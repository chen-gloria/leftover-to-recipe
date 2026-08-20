// Minimal signed-cookie session used to gate "save my recipe book".
//
// This is intentionally lightweight: login is just an email address, no
// password and no verification email. It's enough to let a returning
// visitor keep a private recipe book without building a full auth stack,
// but it means anyone who knows/guesses a visitor's email could sign in
// as them. Fine for a low-stakes demo feature - swap in a real magic-link
// or OTP email flow before this app holds anything sensitive.

import crypto from 'crypto';

const COOKIE_NAME = 'l2r_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    console.warn('SESSION_SECRET not set - using an insecure local-dev default. Set a real secret in production.');
    return 'local-dev-insecure-secret';
  }
  return s;
}

function sign(value) {
  const h = crypto.createHmac('sha256', secret()).update(value).digest('base64url');
  return `${value}.${h}`;
}

function verify(signed) {
  if (!signed) return null;
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  if (sign(value) !== signed) return null;
  return value;
}

export function issueSessionCookie(res, email) {
  const token = encodeURIComponent(sign(email));
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Max-Age=${MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`);
}

export function readSessionEmail(req) {
  const header = req.headers.cookie || '';
  const match = header
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  return verify(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
}
