import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import ShareModal from '../components/ShareModal.jsx';
import LoginModal from '../components/LoginModal.jsx';
import { saveToRecipeBook } from '../api.js';

export default function RecipeDetail({ recipe, onGenerateNew, onBackHome }) {
  const [rating, setRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [saveError, setSaveError] = useState('');

  function handleRate(value) {
    setRating(value);
    setShowThankYou(true);
  }

  async function handleSave() {
    setSaveState('saving');
    setSaveError('');
    try {
      await saveToRecipeBook(recipe);
      setSaveState('saved');
    } catch (err) {
      // The API responds 401 with this message when there's no session -
      // prompt login instead of surfacing it as a hard error.
      if (err.message?.toLowerCase().includes('log in')) {
        setSaveState('idle');
        setShowLogin(true);
      } else {
        setSaveState('error');
        setSaveError(err.message || 'Could not save this recipe.');
      }
    }
  }

  return (
    <>
      <button type="button" className="link-back" onClick={onGenerateNew}>
        <Icon name="arrowLeft" size={16} /> Generate a new recipe
      </button>

      <div className="card card-padded" style={{ marginTop: 'var(--space-4)' }}>
        <div className="recipe-card-header">
          <h2 style={{ marginBottom: 0 }}>{recipe.title}</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowShare(true)}>
              <Icon name="share" size={15} /> Share
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
            >
              <Icon name="bookmark" size={15} />
              {saveState === 'saved' ? 'Saved' : saveState === 'saving' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <span className={`badge ${recipe.isHealthy ? 'badge-primary' : 'badge-accent'}`} style={{ marginBottom: 'var(--space-4)' }}>
          {recipe.isHealthy ? '🥦 Healthy' : '🍩 Relax'}
        </span>

        {saveError && (
          <p className="profile-meta" style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-3)' }}>
            {saveError}
          </p>
        )}

        <h4>Ingredients</h4>
        <ul className="recipe-list">
          {recipe.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>

        <h4>Instructions</h4>
        <ol className="recipe-list recipe-steps">
          {recipe.instructions.map((instruction, i) => (
            <li key={i}>{instruction.replace(/^\d+\.\s*/, '')}</li>
          ))}
        </ol>
      </div>

      <div className="rate-block">
        <h4>Rate this recipe</h4>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} onClick={() => handleRate(value)} className={value <= rating ? 'filled' : ''}>
              ★
            </label>
          ))}
        </div>
      </div>

      {showThankYou && (
        <div className="modal-backdrop" onClick={() => setShowThankYou(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h3>Thank you! 🎉</h3>
            <p className="profile-meta">
              Thanks for your feedback — we'll use it to make the recipes even better.
            </p>
            <div className="cta-group">
              <button type="button" className="btn btn-primary" onClick={onBackHome}>
                Back to home
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowThankYou(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showShare && <ShareModal recipe={recipe} onClose={() => setShowShare(false)} />}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoggedIn={handleSave} />}
    </>
  );
}
