import { useState } from 'react';
import Icon from './Icon.jsx';
import LoginModal from './LoginModal.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar({ onNavigateHome, onNavigateRecipeBook }) {
  const { user, loading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  async function handleLogout() {
    setShowMenu(false);
    await logout();
  }

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

        <div className="navbar-actions">
          <button type="button" className="navbar-home-btn" onClick={onNavigateHome}>
            <Icon name="home" size={16} />
            Home
          </button>

          {!loading && !user && (
            <button type="button" className="navbar-profile-btn" onClick={() => setShowLogin(true)} aria-label="Log in">
              <Icon name="user" size={18} />
            </button>
          )}

          {!loading && user && (
            <div className="navbar-profile-menu">
              <button
                type="button"
                className="navbar-profile-btn navbar-profile-btn-active"
                onClick={() => setShowMenu((v) => !v)}
                aria-label="Account menu"
              >
                {user.email[0].toUpperCase()}
              </button>

              {showMenu && (
                <>
                  <div className="navbar-menu-backdrop" onClick={() => setShowMenu(false)} />
                  <div className="navbar-dropdown">
                    <p className="navbar-dropdown-email">{user.email}</p>
                    <button
                      type="button"
                      className="navbar-dropdown-item"
                      onClick={() => {
                        setShowMenu(false);
                        onNavigateRecipeBook();
                      }}
                    >
                      <Icon name="bookmark" size={16} /> My recipe book
                    </button>
                    <button type="button" className="navbar-dropdown-item" onClick={handleLogout}>
                      <Icon name="logout" size={16} /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}
