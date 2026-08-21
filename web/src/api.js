// Thin fetch wrappers around the two serverless endpoints. Both throw an
// Error whose `.message` is safe to show directly to the user - the 429
// (demo limit) case gets the same treatment as any other failure, so the
// UI never has to special-case it beyond reading the message.

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

function postJSON(url, body) {
  return request(url, { method: 'POST', body: JSON.stringify(body) });
}

export function fetchIngredients({ imageBase64, personPreferences, personAllergies }) {
  return postJSON('/api/ingredients', { imageBase64, personPreferences, personAllergies });
}

export function fetchRecipes({ ingredients, personPreferences, personAllergies }) {
  return postJSON('/api/recipes', { ingredients, personPreferences, personAllergies });
}

// ---- Auth ----

export function fetchMe() {
  return request('/api/auth/me');
}

export function login(email) {
  return postJSON('/api/auth/login', { email });
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

// ---- Recipe book ----

export function fetchRecipeBook() {
  return request('/api/recipe-book');
}

export function saveToRecipeBook(recipe) {
  return postJSON('/api/recipe-book', recipe);
}

export function removeFromRecipeBook(id) {
  return request(`/api/recipe-book?id=${id}`, { method: 'DELETE' });
}

// ---- Public share links ----

export function createShareLink(recipe) {
  return postJSON('/api/share', recipe);
}

export function fetchSharedRecipe(id) {
  return request(`/api/share?id=${id}`);
}
