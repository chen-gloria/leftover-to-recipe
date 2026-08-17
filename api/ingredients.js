import { getIngredients } from './_lib/openai.js';
import { checkRateLimit } from './_lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { allowed, remaining, limit } = await checkRateLimit(req, 'ingredients');
  if (!allowed) {
    res.status(429).json({
      message: `Demo 限额已用完 (每天最多 ${limit} 次识别),请明天再试,或联系我们了解完整版。`
    });
    return;
  }

  try {
    const { imageBase64, personPreferences = '', personAllergies = '' } = req.body || {};
    if (!imageBase64) {
      res.status(400).json({ message: 'Missing image.' });
      return;
    }

    const removedPrefix = imageBase64.replace(/^data:image\/png;base64,/, '');
    const result = await getIngredients(removedPrefix, personPreferences, personAllergies);
    const ingredients = result?.ingredients;

    if (!ingredients || ingredients.length === 0) {
      throw new Error('No ingredients found.');
    }

    res.status(200).json({ ingredients, remaining: remaining });
  } catch (err) {
    console.error('ingredients handler error:', err);
    res.status(502).json({
      message: 'We can not detect the ingredients from your camera - or there is something wrong in the server :(. Please try again or contact us for support.'
    });
  }
}
