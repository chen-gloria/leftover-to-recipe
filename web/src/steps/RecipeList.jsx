import { useState } from 'react';
import Icon from '../components/Icon.jsx';

export default function RecipeList({ recipes, onBack, onConfirm }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <>
      <button type="button" className="link-back" onClick={onBack}>
        <Icon name="arrowLeft" size={16} /> Back to camera
      </button>

      <h2 style={{ marginTop: 'var(--space-4)' }}>Pick a recipe</h2>
      <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
        Two takes on your ingredients — one lighter, one indulgent.
      </p>

      <div className="recipe-grid">
        {recipes.map((recipe, index) => {
          const selected = selectedIndex === index;
          return (
            <button
              type="button"
              key={index}
              className={`recipe-card${selected ? ' selected' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="recipe-card-header">
                <h4>{recipe.Title}</h4>
                <span className={`badge ${recipe.IsHealthy ? 'badge-primary' : 'badge-accent'}`}>
                  {recipe.IsHealthy ? '🥦 Healthy' : '🍩 Relax'}
                </span>
              </div>
              <p className="recipe-card-summary">{recipe.Summary}</p>
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ marginTop: 'var(--space-5)' }}
          onClick={() => onConfirm(recipes[selectedIndex])}
        >
          Show full recipe
        </button>
      )}
    </>
  );
}
