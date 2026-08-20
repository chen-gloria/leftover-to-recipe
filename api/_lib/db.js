// Neon Postgres access for user accounts + saved recipe books.
//
// Uses @neondatabase/serverless (HTTP driver, works great from Vercel
// functions) when DATABASE_URL is set - grab that connection string from
// the Neon console (Project -> Connection Details -> "Pooled connection").
//
// Falls back to an in-process in-memory store (same pattern as
// _lib/rateLimit.js) when DATABASE_URL isn't set, so local dev works
// without a Neon project linked. NOT persistent across restarts/instances
// - local preview only. Production must have DATABASE_URL configured.

const databaseUrl = process.env.DATABASE_URL;
const hasDb = Boolean(databaseUrl);

let sqlPromise;
async function getSql() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(databaseUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS saved_recipes (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          is_healthy BOOLEAN NOT NULL DEFAULT false,
          ingredients JSONB NOT NULL,
          instructions JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        )
      `;
      return sql;
    })();
  }
  return sqlPromise;
}

// ---------------- in-memory fallback (local dev only) ----------------

const memUsers = new Map(); // email -> user
const memRecipes = new Map(); // userId -> recipe[]
let memNextUserId = 1;
let memNextRecipeId = 1;

// ---------------- public API ----------------

export async function findOrCreateUser(email) {
  if (hasDb) {
    const sql = await getSql();
    const rows = await sql`
      INSERT INTO users (email) VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id, email, created_at AS "createdAt"
    `;
    return rows[0];
  }
  let user = memUsers.get(email);
  if (!user) {
    user = { id: memNextUserId++, email, createdAt: new Date().toISOString() };
    memUsers.set(email, user);
  }
  return user;
}

export async function getUserByEmail(email) {
  if (hasDb) {
    const sql = await getSql();
    const rows = await sql`SELECT id, email, created_at AS "createdAt" FROM users WHERE email = ${email}`;
    return rows[0] || null;
  }
  return memUsers.get(email) || null;
}

export async function listSavedRecipes(userId) {
  if (hasDb) {
    const sql = await getSql();
    return sql`
      SELECT id, title, is_healthy AS "isHealthy", ingredients, instructions, created_at AS "createdAt"
      FROM saved_recipes WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
  }
  return (memRecipes.get(userId) || []).slice().reverse();
}

export async function saveRecipe(userId, recipe) {
  const { title, isHealthy, ingredients, instructions } = recipe;
  if (hasDb) {
    const sql = await getSql();
    const rows = await sql`
      INSERT INTO saved_recipes (user_id, title, is_healthy, ingredients, instructions)
      VALUES (${userId}, ${title}, ${!!isHealthy}, ${JSON.stringify(ingredients)}::jsonb, ${JSON.stringify(instructions)}::jsonb)
      RETURNING id, title, is_healthy AS "isHealthy", ingredients, instructions, created_at AS "createdAt"
    `;
    return rows[0];
  }
  const list = memRecipes.get(userId) || [];
  const saved = {
    id: memNextRecipeId++,
    title,
    isHealthy: !!isHealthy,
    ingredients,
    instructions,
    createdAt: new Date().toISOString()
  };
  list.push(saved);
  memRecipes.set(userId, list);
  return saved;
}

export async function deleteRecipe(userId, recipeId) {
  if (hasDb) {
    const sql = await getSql();
    await sql`DELETE FROM saved_recipes WHERE id = ${recipeId} AND user_id = ${userId}`;
    return;
  }
  const list = memRecipes.get(userId) || [];
  memRecipes.set(
    userId,
    list.filter((r) => r.id !== recipeId)
  );
}

export const usingRealDatabase = hasDb;
