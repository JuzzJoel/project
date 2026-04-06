// RegisterForm.jsx
// Handles user registration with the same elegant design as LoginForm

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import api from './api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required.');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Sending registration request:', {
        username: formData.username,
        email: formData.email,
        password: '***'
      });

      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      console.log('Registration response:', response.data);
      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.error ?? err.message ?? 'Registration failed. Please try again.';
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
          --success: #28a745;
          --success-light: #d4edda;
        }

        .register-root {
          min-height: 100vh;
          background-color: var(--paper);
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        /* Left panel */
        .register-panel-left {
          background-color: var(--ink);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 48px;
          position: relative;
          overflow: hidden;
        }

        .register-panel-left::before {
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
        .register-panel-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          overflow-y: auto;
        }

        .register-form-wrap {
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

        /* Success */
        .success-box {
          background: var(--success-light);
          border: 1px solid #c3e6cb;
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

        .error-icon { flex-shrink: 0; margin-top: 1px; color: var(--rust); }
        .success-icon { flex-shrink: 0; margin-top: 1px; color: var(--success); }

        .error-box p {
          font-size: 13px;
          color: #8b2500;
          line-height: 1.4;
        }

        .success-box p {
          font-size: 13px;
          color: #155724;
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

        .input-wrap input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .input-toggle:hover:not(:disabled) { color: var(--ink); }
        .input-toggle:disabled { cursor: not-allowed; opacity: 0.6; }

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

        /* Login link */
        .login-row {
          text-align: center;
          font-size: 13px;
          color: var(--muted);
        }

        .login-row a {
          color: var(--ink);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1.5px solid var(--ink);
          padding-bottom: 1px;
          transition: opacity 0.15s;
        }

        .login-row a:hover { opacity: 0.6; }

        /* Responsive */
        @media (max-width: 768px) {
          .register-root { grid-template-columns: 1fr; }
          .register-panel-left { display: none; }
          .register-panel-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="register-root">
        {/* ── Left decorative panel ── */}
        <div className="register-panel-left">
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
              Join us and unlock new possibilities.
            </p>
            <span className="panel-quote-author">Welcome</span>
          </div>

          <div className="panel-footer">
            <div className="panel-stat">
              <span className="panel-stat-num">5000+</span>
              <span className="panel-stat-label">New members</span>
            </div>
            <div className="panel-stat">
              <span className="panel-stat-num">24/7</span>
              <span className="panel-stat-label">Support</span>
            </div>
            <div className="panel-stat">
              <span className="panel-stat-num">100%</span>
              <span className="panel-stat-label">Secure</span>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="register-panel-right">
          <div className="register-form-wrap">
            <div className="form-heading">
              <h1>Create account.</h1>
              <p>Join our community and get started today.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="error-icon">
                  <FaExclamationCircle />
                </span>
                <p role="alert">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="success-box">
                <span className="success-icon">
                  <FaCheckCircle />
                </span>
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="field">
                <label htmlFor="username">Username</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <FaUser size={14} />
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    disabled={loading}
                    placeholder="choose_your_username"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={loading}
                    placeholder="your_email@example.com"
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="input-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="input-toggle"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <>
                    <FaSpinner className="spin" size={14} />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span className="divider-line" />
              <span>Already have an account?</span>
              <span className="divider-line" />
            </div>

            <div className="login-row">
              <Link to="/login">Sign in instead</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}