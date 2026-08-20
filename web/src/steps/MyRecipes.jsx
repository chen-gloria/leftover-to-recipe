import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { fetchRecipeBook, removeFromRecipeBook } from '../api.js';

export default function MyRecipes({ onBack, onView }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipeBook()
      .then((data) => setRecipes(data.recipes || []))
      .catch((err) => setError(err.message || 'Could not load your recipe book.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    try {
      await removeFromRecipeBook(id);
    } catch (err) {
      setError(err.message || 'Could not remove that recipe.');
    }
  }

  return (
    <>
      <button type="button" className="link-back" onClick={onBack}>
        <Icon name="arrowLeft" size={16} /> Back
      </button>

      <h2 style={{ marginTop: 'var(--space-4)' }}>My recipe book</h2>
      <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
        Recipes you've saved, kept under your account.
      </p>

      {error && (
        <p className="profile-meta" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}

      {loading && <p className="profile-meta">Loading…</p>}

      {!loading && recipes.length === 0 && !error && (
        <div className="card card-padded" style={{ textAlign: 'center' }}>
          <p className="profile-meta">No saved recipes yet — generate one and hit "Save to my recipe book".</p>
        </div>
      )}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-card-header">
              <h4>{recipe.title}</h4>
              <span className={`badge ${recipe.isHealthy ? 'badge-primary' : 'badge-accent'}`}>
                {recipe.isHealthy ? '🥦 Healthy' : '🍩 Relax'}
              </span>
            </div>
            <p className="recipe-card-summary">{recipe.ingredients.slice(0, 4).join(', ')}…</p>
            <div className="cta-group" style={{ marginTop: 'var(--space-3)' }}>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => onView(recipe)}>
                View
              </button>
              <button type="button" className="btn btn-sm btn-outline" onClick={() => handleDelete(recipe.id)}>
                <Icon name="trash" size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
