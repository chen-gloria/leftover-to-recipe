import { useState } from 'react';
import FlashMessage from '../components/FlashMessage.jsx';
import Icon from '../components/Icon.jsx';

export default function Ingredients({
  ingredients,
  personAllergies,
  personPreferences,
  onChangeAllergies,
  onChangePreferences,
  onBack,
  onSubmit,
  isSubmitting,
  errorMessage,
  onDismissError
}) {
  const [items, setItems] = useState(ingredients.length ? ingredients : ['']);

  function updateItem(index, value) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function removeItem(index) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : ['']));
  }

  function addItem() {
    setItems((prev) => [...prev, '']);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const cleaned = items.map((item) => item.trim()).filter(Boolean);
    onSubmit(cleaned);
  }

  return (
    <>
      <FlashMessage type="danger" message={errorMessage} onDismiss={onDismissError} />

      <button type="button" className="link-back" onClick={onBack}>
        <Icon name="arrowLeft" size={16} /> Back to camera
      </button>

      <h2 style={{ marginTop: 'var(--space-4)' }}>Confirm your ingredients</h2>
      <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
        Edit, remove, or add anything we missed.
      </p>

      <form onSubmit={handleSubmit} className="stack" style={{ gap: 'var(--space-5)' }}>
        <div className="card card-padded">
          <div className="pref-fields">
            <label className="pref-field">
              <span className="pref-field-label">Preferences</span>
              <input
                type="text"
                autoComplete="off"
                value={personPreferences}
                onChange={(e) => onChangePreferences(e.target.value)}
              />
            </label>
            <label className="pref-field">
              <span className="pref-field-label">Allergies</span>
              <input
                type="text"
                autoComplete="off"
                value={personAllergies}
                onChange={(e) => onChangeAllergies(e.target.value)}
              />
            </label>
          </div>

          <div className="ingredient-chips">
            {items.map((item, index) => (
              <div className="ingredient-chip" key={index}>
                <input
                  type="text"
                  placeholder="add ingredient…"
                  autoComplete="off"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                />
                <button
                  type="button"
                  className="ingredient-chip-remove"
                  aria-label="Remove ingredient"
                  onClick={() => removeItem(index)}
                >
                  <Icon name="x" size={13} />
                </button>
              </div>
            ))}

            <button type="button" className="ingredient-chip-add" onClick={addItem}>
              <Icon name="plusCircle" size={16} /> Add
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          Generate recipes
        </button>
      </form>

      {isSubmitting && (
        <div id="loading-overlay">
          <div className="spinner" role="status" aria-label="Loading" />
        </div>
      )}
    </>
  );
}
