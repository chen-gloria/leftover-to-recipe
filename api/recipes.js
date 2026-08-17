import { getRecipes } from './_lib/openai.js';
import { checkRateLimit } from './_lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { allowed, remaining, limit } = await checkRateLimit(req, 'recipes');
  if (!allowed) {
    res.status(429).json({
      message: `Demo 限额已用完 (每天最多 ${limit} 次生成),请明天再试,或联系我们了解完整版。`
    });
    return;
  }

  try {
    const { ingredients, personPreferences = '', personAllergies = '' } = req.body || {};
    if (!ingredients || ingredients.length === 0) {
      res.status(400).json({ message: 'Missing ingredients.' });
      return;
    }

    const recipes = await getRecipes(ingredients, personPreferences, personAllergies);
    // The model is prompted with two example JSON objects (not wrapped in an
    // array), so normalize whatever shape comes back into a flat recipe array:
    // - already an array -> use as-is
    // - a single recipe object (has a Title) -> wrap it
    // - an object keyed by recipe name/index -> take its values
    let recipeList;
    if (Array.isArray(recipes)) {
      recipeList = recipes;
    } else if (recipes && typeof recipes === 'object' && 'Title' in recipes) {
      recipeList = [recipes];
    } else {
      recipeList = Object.values(recipes || {});
    }

    res.status(200).json({ recipes: recipeList, remaining });
  } catch (err) {
    console.error('recipes handler error:', err);
    res.status(502).json({
      message: 'We can not generate recipe for now - there is something wrong in the server :(. Please try again or contact us for support.'
    });
  }
}
