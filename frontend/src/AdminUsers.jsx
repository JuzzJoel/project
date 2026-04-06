import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaArrowLeft, FaTrash, FaLock, FaSpinner } from 'react-icons/fa';
import api from './api';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You do not have admin access.');
      } else {
        setError('Failed to fetch users.');
      }
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId, username) {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      setDeleting(userId);
      try {
        await api.post('/api/admin/users/delete', { userId });
        setUsers(users.filter(u => u.id !== userId));
        setSuccess(`User "${username}" deleted successfully.`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user.');
      } finally {
        setDeleting(null);
      }
    }
  }

  async function handleToggleAdmin(userId, currentStatus) {
    try {
      await api.post('/api/admin/users/set-admin', {
        userId,
        isAdmin: !currentStatus,
      });
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
      setSuccess(`Admin status updated successfully.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update admin status.');
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error && error.includes('Admin')) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>Access Denied</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} style={styles.button}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

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
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          <FaArrowLeft /> Dashboard
        </button>
        <h1><FaUsers /> Admin Panel - Users Management</h1>
      </div>

      {error && <div style={styles.error} className="slide-down">{error}</div>}
      {success && <div style={styles.success} className="slide-down">{success}</div>}

      <div style={styles.stats}>
        <div style={styles.stat}>
          <p style={styles.statValue}>{users.length}</p>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.stat}>
          <p style={styles.statValue}>{users.filter(u => u.is_admin).length}</p>
          <p style={styles.statLabel}>Admins</p>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Admin</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={styles.row}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={{...styles.avatar, backgroundColor: user.avatar_color}}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <span style={{...styles.badge, ...( user.is_admin ? styles.badgeAdmin : styles.badgeUser)}}>
                    {user.is_admin ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                      title={user.is_admin ? 'Remove admin' : 'Make admin'}
                      style={{...styles.actionBtn, ...styles.adminBtn}}
                    >
                      <FaLock />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      disabled={deleting === user.id}
                      title="Delete user"
                      style={{...styles.actionBtn, ...styles.deleteBtn, opacity: deleting === user.id ? 0.5 : 1}}
                    >
                      {deleting === user.id ? <FaSpinner className="spin" /> : <FaTrash />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  backButton: {
    background: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  stat: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#667eea',
    margin: '0 0 10px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  tableWrapper: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  th: {
    padding: '15px 20px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
  },
  row: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background 0.2s',
    '&:hover': {
      background: '#f9fafb',
    },
  },
  td: {
    padding: '15px 20px',
    fontSize: '14px',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeAdmin: {
    background: '#DCF0FF',
    color: '#0066CC',
  },
  badgeUser: {
    background: '#F0F0F0',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  adminBtn: {
    background: '#DCF0FF',
    color: '#0066CC',
  },
  deleteBtn: {
    background: '#FEE2E2',
    color: '#DC2626',
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
  errorBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '100px auto',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
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
