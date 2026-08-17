// Thin fetch wrappers around the two serverless endpoints. Both throw an
// Error whose `.message` is safe to show directly to the user - the 429
// (demo limit) case gets the same treatment as any other failure, so the
// UI never has to special-case it beyond reading the message.

async function postJSON(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export function fetchIngredients({ imageBase64, personPreferences, personAllergies }) {
  return postJSON('/api/ingredients', { imageBase64, personPreferences, personAllergies });
}

export function fetchRecipes({ ingredients, personPreferences, personAllergies }) {
  return postJSON('/api/recipes', { ingredients, personPreferences, personAllergies });
}
