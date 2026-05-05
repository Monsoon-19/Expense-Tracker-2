import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, AlertTriangle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, firebaseReady } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await register(email, password, displayName);
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo" aria-hidden="true">
            <Wallet />
          </div>
          <h1>Expense Tracker</h1>
          <p>Save your money, track your spending</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Authentication">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
              role="tab"
              aria-selected={isLogin}
              id="tab-signin"
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
              role="tab"
              aria-selected={!isLogin}
              id="tab-signup"
            >
              Sign Up
            </button>
          </div>

          {!firebaseReady && (
            <div className="auth-error" role="alert" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} />
              <span>Firebase not configured. Copy <code>.env.example</code> to <code>.env</code> and add your Firebase credentials.</span>
            </div>
          )}

          {error && (
            <div className="auth-error" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="displayName">Full Name</label>
                <input
                  id="displayName"
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
