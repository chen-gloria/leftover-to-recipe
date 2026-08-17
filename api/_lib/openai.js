// Shared OpenAI proxy helpers. Prompts are ported 1:1 from the original
// Symfony app's src/Service/OpenAIService.php so behavior stays identical.

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
// gpt-4o-mini supports vision too and is ~16.7x cheaper than gpt-4o
// ($0.15/$0.60 vs $2.50/$10.00 per 1M input/output tokens) - the right
// call for a public, rate-limited demo doing simple ingredient ID + recipe generation.
const MODEL = 'gpt-4o-mini';

async function callOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.0
    })
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error?.message || `OpenAI request failed (${response.status})`);
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI response had no content.');
  }

  // The model sometimes wraps JSON in ```json fences - strip them, same as the PHP version did.
  const cleaned = content.replace(/```json/g, '').replace(/\n/g, '').replace(/```/g, '');
  return JSON.parse(cleaned);
}

export function getIngredients(base64Image, personPreferences = '', personAllergies = '') {
  const prompt = `Extract the ingredients present in the image. The input image could be a photo of ingredients or a reciept of ingredients.

User preferences: ${personPreferences}.
User allergies: ${personAllergies}.

Return the ingredients in the following format:
{
    "ingredients": ["Red beans", "Spinach", "Olives", ...]
}

JSON:`;

  return callOpenAI([
    { role: 'system', content: 'You are a helpful assistant that responds in JSON' },
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } }
      ]
    }
  ]);
}

export function getRecipes(ingredientsList, personPreferences = '', personAllergies = '') {
  const prompt = `Given the following ingredients list: ${JSON.stringify(ingredientsList)}.

User preferences: ${personPreferences}.
User allergies: ${personAllergies}.

Generate recipes (along with the ingredients), return at least 2 recipies, one which is healthy, and one which is unhealthy.
Restrict the recipes with the ingredients provided above.

Return Dish Title, Ingredients and Instructions in JSON.

For example:
{
    "IsHealthy": true,
    "Title": "Tempeh Stir-Fry",
    "Ingredients": ["Tempeh", "Red chili peppers", ... ],
    "Instructions": ["1. Slice the tempeh into thin strips.", "2. Heat a pan over medium heat and add a bit of oil.", "3. Add minced garlic, ginger, and lemongrass to the pan and saute until fragrant."...],
    "Summary": "This dish is a healthy and delicious vegan stir-fry that is packed with flavor and nutrients."
}
{
    "IsHealthy": false,
    "Title": "Fried Tempeh with Spicy Peanut Sauce",
    "Ingredients": ["Tempeh", "Red chili peppers", ... ],
    "Instructions": ["1. Slice the tempeh into thin strips.", "2. Heat a generous amount of oil in a pan over medium-high heat and fry the tempeh until crispy and golden brown. Drain on paper towels."...],
    "Summary": "This dish is a delicious and indulgent vegan treat that is perfect for a special occasion or when you want to impress your guests."
}

JSON:`;

  return callOpenAI([
    { role: 'system', content: 'You are a helpful assistant that responds in JSON' },
    { role: 'user', content: [{ type: 'text', text: prompt }] }
  ]);
}
