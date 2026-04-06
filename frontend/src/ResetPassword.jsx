import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from './api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('reset'); // 'reset' or 'success'
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        resetToken: token,
        newPassword,
      });

      setStep('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-down { animation: slideDown 0.3s ease-out; }
        .slide-right { animation: slideRight 0.4s ease-out; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {step === 'reset' ? (
        <div style={styles.card} className="slide-right">
          <div style={styles.iconWrapper}>
            <FaLock style={styles.icon} />
          </div>
          <h1 style={styles.title}>Reset Your Password</h1>
          <p style={styles.subtitle}>Enter your new password below</p>

          <form onSubmit={handleResetPassword} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={styles.input}
              />
            </div>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show passwords
            </label>

            {error && (
              <div style={styles.error} className="slide-down">
                <FaExclamationCircle style={{marginRight: '8px'}} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? <span className="spin">⚙️</span> : ''}
              {loading ? ' Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div style={styles.footer}>
            <a onClick={() => navigate('/login')} style={styles.link}>Back to Login</a>
          </div>
        </div>
      ) : (
        <div style={styles.card} className="slide-right">
          <div style={styles.successIconWrapper}>
            <FaCheckCircle style={styles.successIcon} />
          </div>
          <h1 style={styles.successTitle}>Password Reset Successfully!</h1>
          <p style={styles.successMessage}>Your password has been updated.<br />Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  iconWrapper: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  icon: {
    fontSize: '48px',
    color: '#667eea',
  },
  successIconWrapper: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  successIcon: {
    fontSize: '48px',
    color: '#10B981',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '10px',
    textAlign: 'center',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#10B981',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  successMessage: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
    gap: '8px',
  },
  button: {
    padding: '12px 20px',
    marginTop: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  error: {
    background: '#FEE2E2',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #FECACA',
    display: 'flex',
    alignItems: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};
