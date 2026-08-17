const STEPS = ['Preferences', 'Ingredients', 'Recipes', 'Enjoy'];

export default function StepIndicator({ current }) {
  return (
    <div>
      <div className="step-indicator">
        {STEPS.map((_, i) => (
          <div key={i} className={`dot${i < current ? ' done' : ''}${i === current ? ' current' : ''}`} />
        ))}
      </div>
      <p className="step-label">
        Step {current + 1} of {STEPS.length} · {STEPS[current]}
      </p>
    </div>
  );
}
