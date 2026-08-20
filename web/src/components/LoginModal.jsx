import { useState } from 'react';
import Icon from './Icon.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function LoginModal({ onClose, onLoggedIn }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim());
      onLoggedIn?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Could not log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <Icon name="x" size={18} />
        </button>

        <div className="icon-circle" style={{ margin: '0 auto var(--space-3)', width: 48, height: 48 }}>
          <Icon name="user" size={22} />
        </div>

        <h3>Log in to save recipes</h3>
        <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
          Enter your email — no password needed. We'll keep your recipe book under this address.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label className="form-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />

          {error && (
            <p className="profile-meta" style={{ color: 'var(--color-danger)', marginTop: 'var(--space-2)' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Continue'}
          </button>
        </form>

        <p className="profile-meta" style={{ marginTop: 'var(--space-3)', fontSize: 12 }}>
          Demo login: this only checks that it looks like an email, no verification email is sent. Don't reuse a
          sensitive password-protected account here.
        </p>
      </div>
    </div>
  );
}
