// LoginForm.jsx
// Handles login via cookie-based response. No token storage in JS.
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './api';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    const state = location.state;
    if (state?.message) {
      setSuccess(state.message);
    }
  }, [location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/login', { username, password });
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error ?? 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0f0e0d;
          --paper: #faf8f5;
          --cream: #f2ede6;
          --rust: #c0431f;
          --rust-light: #f9ece8;
          --muted: #8a8278;
          --border: #ddd8d0;
          --focus: #c0431f;
        }

        .login-root {
          min-height: 100vh;
          background-color: var(--paper);
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        /* Left panel */
        .login-panel-left {
          background-color: var(--ink);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 48px;
          position: relative;
          overflow: hidden;
        }

        .login-panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 20% 80%, #3a1a0a 0%, transparent 70%),
                      radial-gradient(ellipse 60% 40% at 80% 20%, #1a1208 0%, transparent 60%);
        }

        .panel-logo {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-logo-mark {
          width: 32px;
          height: 32px;
          background: var(--rust);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .panel-logo-name {
          font-family: 'Instrument Serif', serif;
          font-size: 20px;
          color: #fff;
          letter-spacing: 0.01em;
        }

        .panel-quote {
          position: relative;
          z-index: 1;
        }

        .panel-quote-mark {
          font-family: 'Instrument Serif', serif;
          font-size: 96px;
          line-height: 0.7;
          color: var(--rust);
          margin-bottom: 24px;
          display: block;
        }

        .panel-quote-text {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          line-height: 1.4;
          color: #f0ece6;
          font-style: italic;
          margin-bottom: 20px;
        }

        .panel-quote-author {
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .panel-footer {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 32px;
        }

        .panel-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .panel-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          color: #fff;
        }

        .panel-stat-label {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Right panel */
        .login-panel-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 380px;
        }

        .form-heading {
          margin-bottom: 36px;
        }

        .form-heading h1 {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          color: var(--ink);
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .form-heading p {
          font-size: 14px;
          color: var(--muted);
          font-weight: 400;
        }

        /* Error */
        .error-box {
          background: var(--rust-light);
          border: 1px solid #e8b4a8;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .error-icon { flex-shrink: 0; margin-top: 1px; }

        .error-box p {
          font-size: 13px;
          color: #8b2500;
          line-height: 1.4;
        }

        /* Field */
        .field { margin-bottom: 20px; }

        .field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }

        .input-wrap { position: relative; }

        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .input-wrap input {
          width: 100%;
          padding: 11px 12px 11px 40px;
          background: var(--cream);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--ink);
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none;
        }

        .input-wrap input::placeholder { color: #b5afa8; }

        .input-wrap input:focus {
          border-color: var(--focus);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(192, 67, 31, 0.1);
        }

        .input-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .input-toggle:hover { color: var(--ink); }

        /* Row */
        .form-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          color: var(--muted);
        }

        .checkbox-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: var(--rust);
          cursor: pointer;
        }

        .forgot-link {
          font-size: 13px;
          color: var(--rust);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.15s;
        }

        .forgot-link:hover { opacity: 0.7; }

        /* Submit */
        .btn-submit {
          width: 100%;
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }

        .btn-submit:hover:not(:disabled) { background: #2a2825; transform: translateY(-1px); }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .divider span {
          font-size: 12px;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Signup */
        .signup-row {
          text-align: center;
          font-size: 13px;
          color: var(--muted);
        }

        .signup-row a {
          color: var(--ink);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1.5px solid var(--ink);
          padding-bottom: 1px;
          transition: opacity 0.15s;
        }

        .signup-row a:hover { opacity: 0.6; }

        /* Demo hint */
        .demo-hint {
          margin-top: 28px;
          padding: 12px 14px;
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 12px;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demo-hint strong { color: var(--ink); font-weight: 600; }

        /* Responsive */
        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .login-panel-left { display: none; }
          .login-panel-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="login-root">
        {/* ── Left decorative panel ── */}
        <div className="login-panel-left">
          <div className="panel-logo">
            <div className="panel-logo-mark">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2L15.5 5.75V12.25L9 16L2.5 12.25V5.75L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="9" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="panel-logo-name">Northgate</span>
          </div>

          <div className="panel-quote">
            <span className="panel-quote-mark">"</span>
            <p className="panel-quote-text">
              The best interface is the one that stays out of your way.
            </p>
            <span className="panel-quote-author">Design Principle #1</span>
          </div>

          <div className="panel-footer">
            <div className="panel-stat">
              <span className="panel-stat-num">12k+</span>
              <span className="panel-stat-label">Active users</span>
            </div>
            <div className="panel-stat">
              <span className="panel-stat-num">99.9%</span>
              <span className="panel-stat-label">Uptime</span>
            </div>
            <div className="panel-stat">
              <span className="panel-stat-num">4.9★</span>
              <span className="panel-stat-label">Avg rating</span>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="login-panel-right">
          <div className="login-form-wrap">
            <div className="form-heading">
              <h1>Welcome back.</h1>
              <p>Sign in to continue to your dashboard.</p>
            </div>

            {/* Success */}
            {success && (
              <div className="error-box" style={{background: 'var(--rust-light)', borderColor: '#e8b4a8'}}>
                <span className="error-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="#28a745" strokeWidth="1.5"/>
                    <path d="M6 8l2 2 4-4" stroke="#28a745" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <p style={{color: '#155724'}}>{success}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="error-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="#c0431f" strokeWidth="1.5"/>
                    <path d="M8 5v3.5" stroke="#c0431f" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="8" cy="11" r="0.75" fill="#c0431f"/>
                  </svg>
                </span>
                <p role="alert">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="field">
                <label htmlFor="username">Username</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    placeholder="your_username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="input-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2l12 12M6.5 6.62A2 2 0 009.38 9.5M5.27 4.03C3.6 5 2.3 6.36 1.5 8c1.35 2.73 4.06 4.5 6.5 4.5 1.04 0 2.04-.27 2.93-.74M10.88 10.88C12.49 9.92 13.74 8.58 14.5 7 13.15 4.27 10.44 2.5 8 2.5c-.95 0-1.87.22-2.72.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 8C2.85 5.27 5.56 3.5 8 3.5s5.15 1.77 6.5 4.5C13.15 10.73 10.44 12.5 8 12.5S2.85 10.73 1.5 8Z" stroke="currentColor" strokeWidth="1.4"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Row */}
              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <>
                    <svg className="spin" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span className="divider-line" />
              <span>New here?</span>
              <span className="divider-line" />
            </div>

            <div className="signup-row">
              Don't have an account?{' '}
              <a href="/register">Create one</a>
            </div>

            {/* Demo hint — remove in production */}
            <div className="demo-hint">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 6v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="7" cy="4.5" r="0.6" fill="currentColor"/>
              </svg>
              Demo credentials: <strong>demo</strong> / <strong>demo123</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}