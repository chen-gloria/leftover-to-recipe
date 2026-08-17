import Icon from '../components/Icon.jsx';
import Avatar from '../components/Avatar.jsx';

const FRIEND_POSTS = [
  {
    name: 'Bryce',
    city: 'Canberra',
    recipeTitle: 'Spicy Thai Basil Chicken',
    allergies: 'Contains soy; avoid if allergic.',
    preferences: 'Asian cuisine enthusiasts; spicy food lovers.',
    hashTags: '#ThaiFlavors #FieryDelight',
    emoji: '🌶️',
    color: '#ffe4de'
  },
  {
    name: 'Daniel',
    city: 'Sydney',
    recipeTitle: 'Mediterranean Quinoa Salad',
    allergies: 'Contains dairy (feta)',
    preferences: 'Vegetarians; Mediterranean cuisine aficionados.',
    hashTags: '#MediterraneanEats #FreshAndLight',
    emoji: '🥗',
    color: '#dff5f0'
  },
  {
    name: 'Nissan',
    city: 'Brisbane',
    recipeTitle: 'Black Bean Tacos',
    allergies: 'Contains gluten (tortillas)',
    preferences: 'Mexican food enthusiasts; vegetarian-friendly option.',
    hashTags: '#TacoTuesday #MexicanCuisine',
    emoji: '🌮',
    color: '#fff2d6'
  },
  {
    name: 'Akhil',
    city: 'Perth',
    recipeTitle: 'Lemon Garlic Shrimp Pasta',
    allergies: 'Contains shellfish',
    preferences: 'Seafood lovers; Italian cuisine admirers.',
    hashTags: '#SeafoodPasta #GarlicShrimp',
    emoji: '🍤',
    color: '#e3edff'
  },
  {
    name: 'Jordi H.',
    city: 'Melbourne',
    recipeTitle: 'Vegan Chickpea Curry',
    allergies: 'Contains coconut.',
    preferences: 'Vegans; lovers of Indian flavors.',
    hashTags: '#VeganComfort #CurryLove',
    emoji: '🍛',
    color: '#fff0e8'
  },
  {
    name: 'Jan Z.',
    city: 'Singapore',
    recipeTitle: 'BBQ Pulled Pork Sandwiches',
    allergies: 'Contains gluten (buns)',
    preferences: 'BBQ aficionados; meat lovers.',
    hashTags: '#BBQClassic #PulledPork',
    emoji: '🍖',
    color: '#f3e8ff'
  }
];

export default function BasicInfo({
  personAllergies,
  personPreferences,
  onChangeAllergies,
  onChangePreferences,
  onEnterManually,
  onTakePicture
}) {
  return (
    <>
      <div className="hero-banner">
        <span className="hero-emoji" aria-hidden="true">
          🌎
        </span>
        <strong>Minimise food waste — let's make the world a better place, one plate at a time.</strong>
      </div>

      <div className="card card-padded profile-card">
        <div className="profile-header">
          <Avatar emoji="🥑" bg="var(--color-primary-soft)" size={64} />
          <div>
            <h3 className="profile-name">Annie L.</h3>
            <p className="profile-meta">📍 Canberra</p>
          </div>
          <span className="badge badge-primary profile-level">⭐ Zero Waste Hero</span>
        </div>

        <div className="pref-fields">
          <label className="pref-field">
            <span className="pref-field-label">Allergies</span>
            <input
              type="text"
              value={personAllergies}
              autoComplete="off"
              onChange={(e) => onChangeAllergies(e.target.value)}
            />
          </label>
          <label className="pref-field">
            <span className="pref-field-label">Preferences</span>
            <input
              type="text"
              value={personPreferences}
              autoComplete="off"
              onChange={(e) => onChangePreferences(e.target.value)}
            />
          </label>
        </div>

        <div className="cta-group">
          <button type="button" className="btn btn-outline btn-block" onClick={onEnterManually}>
            <Icon name="edit" size={17} /> Enter your own ingredients
          </button>
          <button type="button" className="btn btn-primary btn-block" onClick={onTakePicture}>
            <Icon name="camera" size={17} /> Take a picture of your ingredients
          </button>
        </div>
      </div>

      <section className="section">
        <h3 className="section-heading">
          <Icon name="people" size={20} /> Community
        </h3>
        <div className="community-grid">
          {FRIEND_POSTS.map((post) => (
            <div className="community-card" key={post.name}>
              <Avatar emoji={post.emoji} bg={post.color} size={48} />
              <div className="community-card-body">
                <h4>{post.name}</h4>
                <p className="profile-meta">📍 {post.city}</p>
                <p className="community-field">
                  <strong>Allergies</strong> {post.allergies}
                </p>
                <p className="community-field">
                  <strong>Preferences</strong> {post.preferences}
                </p>
                <p className="community-tags">{post.hashTags}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
