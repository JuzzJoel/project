import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaFileAlt, FaPalette, FaSave, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import api from '../api';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  async function fetchUserInfo() {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setBio(response.data.user.bio || '');
      setAvatarColor(response.data.user.avatar_color || '#3B82F6');
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/auth/profile', {
        bio,
        avatar_color: avatarColor,
      });

      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const avatarInitial = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .slide-down { animation: slideDown 0.3s ease-out; }
      `}</style>

      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton} title="Back to Dashboard">
          <FaArrowLeft /> Back
        </button>
        <h1>Edit Profile</h1>
        <button onClick={handleLogout} style={styles.logoutButton} title="Logout">
          <FaSignOutAlt />
        </button>
      </div>

      {error && <div style={styles.error} className="slide-down">{error}</div>}
      {success && <div style={styles.success} className="slide-down">{success}</div>}

      <div style={styles.content}>
        <div style={styles.avatarSection}>
          <div style={{ ...styles.avatar, backgroundColor: avatarColor }}>
            {avatarInitial}
          </div>
          <div style={styles.userInfo}>
            <h2>{user?.username}</h2>
            <p style={styles.email}>{user?.email}</p>
            <p style={styles.joinedDate}>Joined {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaFileAlt style={styles.labelIcon} />
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={500}
              style={styles.textarea}
            />
            <p style={styles.charCount}>{bio.length}/500 characters</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaPalette style={styles.labelIcon} />
              Avatar Color
            </label>
            <div style={styles.colorGrid}>
              {['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  style={{
                    ...styles.colorOption,
                    backgroundColor: color,
                    border: avatarColor === color ? '4px solid #000' : '2px solid #ccc',
                  }}
                  title={`Select ${color}`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ ...styles.submitButton, opacity: saving ? 0.6 : 1 }}
          >
            <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backButton: {
    background: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    color: '#667eea',
    transition: 'transform 0.2s',
  },
  logoutButton: {
    background: '#EF4444',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '18px',
    transition: 'background 0.2s',
  },
  content: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
  },
  email: {
    color: '#666',
    margin: '5px 0 10px 0',
    fontSize: '14px',
  },
  joinedDate: {
    color: '#999',
    fontSize: '12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  labelIcon: {
    fontSize: '16px',
    color: '#667eea',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
  },
  charCount: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '10px',
  },
  colorOption: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  error: {
    background: '#FEE2E2',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #FECACA',
  },
  success: {
    background: '#DCFCE7',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #86EFAC',
  },
  spinner: {
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '40px auto',
  },
};
