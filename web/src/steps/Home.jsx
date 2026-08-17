import Icon from '../components/Icon.jsx';

const HOW_IT_WORKS = [
  { emoji: '📸', title: 'Snap a photo', body: 'Your fridge, pantry, or a grocery receipt — whatever you\'ve got.' },
  { emoji: '🧠', title: 'AI reads it', body: 'We identify the ingredients for you — or type them in yourself.' },
  { emoji: '🍽️', title: 'Get two recipes', body: 'One lighter, one indulgent — pick one and cook.' }
];

export default function Home({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-hero">
        <span className="landing-emoji" aria-hidden="true">
          🍲
        </span>
        <h1>Turn your leftovers into your next meal</h1>
        <p className="landing-subtitle">
          Snap a photo of what's in your fridge and get real recipes back in seconds — less food
          waste, less "what's for dinner" stress.
        </p>
        <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
          Get started <Icon name="arrowLeft" size={18} style={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>

      <div className="landing-steps">
        {HOW_IT_WORKS.map((step, i) => (
          <div className="landing-step" key={step.title}>
            <span className="landing-step-num">{i + 1}</span>
            <span className="landing-step-emoji" aria-hidden="true">
              {step.emoji}
            </span>
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </div>
        ))}
      </div>

      <div className="landing-note">
        🌱 This is a free public demo, capped at a few AI scans per day per visitor so everyone
        gets a turn — if you hit the limit, just try again tomorrow.
      </div>
    </div>
  );
}
