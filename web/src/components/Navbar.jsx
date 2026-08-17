import Icon from './Icon.jsx';

export default function Navbar({ onNavigateHome }) {
  return (
    <header className="navbar">
      <div className="page-container navbar-inner">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="navbar-brand"
        >
          <span className="navbar-logo" aria-hidden="true">
            🍲
          </span>
          <span className="navbar-title">Leftover to Recipe</span>
        </a>

        <button type="button" className="navbar-home-btn" onClick={onNavigateHome}>
          <Icon name="home" size={16} />
          Home
        </button>
      </div>
    </header>
  );
}
