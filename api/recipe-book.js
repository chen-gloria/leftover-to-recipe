import { getUserByEmail, listSavedRecipes, saveRecipe, deleteRecipe } from './_lib/db.js';
import { readSessionEmail } from './_lib/session.js';

async function requireUser(req, res) {
  const email = readSessionEmail(req);
  if (!email) {
    res.status(401).json({ message: 'Please log in to manage your recipe book.' });
    return null;
  }
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(401).json({ message: 'Please log in to manage your recipe book.' });
    return null;
  }
  return user;
}

export default async function handler(req, res) {
  try {
    const user = await requireUser(req, res);
    if (!user) return;

    if (req.method === 'GET') {
      const recipes = await listSavedRecipes(user.id);
      res.status(200).json({ recipes });
      return;
    }

    if (req.method === 'POST') {
      const { title, isHealthy, ingredients, instructions } = req.body || {};
      if (!title || !ingredients || !instructions) {
        res.status(400).json({ message: 'Missing recipe fields.' });
        return;
      }
      const recipe = await saveRecipe(user.id, { title, isHealthy, ingredients, instructions });
      res.status(200).json({ recipe });
      return;
    }

    if (req.method === 'DELETE') {
      const id = Number(req.query?.id);
      if (!id) {
        res.status(400).json({ message: 'Missing recipe id.' });
        return;
      }
      await deleteRecipe(user.id, id);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('recipe-book handler error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
