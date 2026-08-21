// Public share links: no login required, either to create one (POST) or
// to open one (GET) - anyone with the link can view that recipe. Backed by
// shared_recipes, a separate table from each user's private saved_recipes.

import { createSharedRecipe, getSharedRecipeById } from './_lib/db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { title, isHealthy, ingredients, instructions } = req.body || {};
      if (!title || !ingredients || !instructions) {
        res.status(400).json({ message: 'Missing recipe fields.' });
        return;
      }
      const recipe = await createSharedRecipe({ title, isHealthy, ingredients, instructions });
      res.status(200).json({ id: recipe.id });
      return;
    }

    if (req.method === 'GET') {
      const id = Number(req.query?.id);
      if (!id) {
        res.status(400).json({ message: 'Missing recipe id.' });
        return;
      }
      const recipe = await getSharedRecipeById(id);
      if (!recipe) {
        res.status(404).json({ message: 'This shared recipe could not be found.' });
        return;
      }
      res.status(200).json({ recipe });
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('share handler error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
