// Per-IP, per-endpoint, per-day call limiter.
//
// Uses Upstash Redis (via the Vercel Marketplace "Upstash" integration -
// Vercel's own KV product is deprecated in favor of this) when a store is
// connected. The integration injects either `KV_REST_API_URL`/
// `KV_REST_API_TOKEN` (older "Vercel KV" naming, still used by some
// integration flows) or `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`
// - we accept either.
//
// Falls back to an in-process Map when neither pair is present, e.g. local
// `vite`/`vercel dev` without a linked store. The fallback is NOT reliable
// across serverless instances/cold starts - it exists purely so local
// development works without extra setup. Production must have Upstash
// connected for the limit to actually hold.

export const DAILY_LIMIT_PER_ENDPOINT = 5;

const memoryStore = new Map();

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient;
async function getRedis() {
  if (!redisClient) {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({ url: redisUrl, token: redisToken });
  }
  return redisClient;
}

async function incrWithRedis(key) {
  const redis = await getRedis();
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24); // 24h
  }
  return count;
}

function incrWithMemory(key) {
  const entry = memoryStore.get(key);
  const now = Date.now();
  if (!entry || entry.expiresAt < now) {
    memoryStore.set(key, { count: 1, expiresAt: now + 24 * 60 * 60 * 1000 });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

const hasRedis = Boolean(redisUrl && redisToken);

/**
 * Checks and increments today's call count for this IP+endpoint.
 * Returns { allowed, remaining, limit }.
 */
export async function checkRateLimit(req, endpointName) {
  const ip = clientIp(req);
  const key = `ratelimit:${endpointName}:${ip}:${todayKey()}`;

  let count;
  try {
    count = hasRedis ? await incrWithRedis(key) : incrWithMemory(key);
  } catch (err) {
    // Redis hiccup (full store, network blip, etc.) - fail OPEN rather than
    // 500ing the whole endpoint. The OpenAI-side org spend cap is the
    // backstop for cost if this ever masks real abuse.
    console.error(`rate limit check failed for ${key}, allowing request:`, err);
    return { allowed: true, remaining: DAILY_LIMIT_PER_ENDPOINT, limit: DAILY_LIMIT_PER_ENDPOINT };
  }

  return {
    allowed: count <= DAILY_LIMIT_PER_ENDPOINT,
    remaining: Math.max(0, DAILY_LIMIT_PER_ENDPOINT - count),
    limit: DAILY_LIMIT_PER_ENDPOINT
  };
}
