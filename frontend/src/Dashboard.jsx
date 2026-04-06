import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaSignOutAlt, FaChartLine, FaUsers, FaActivity, FaGithub, FaEdit, FaShield } from 'react-icons/fa'
import api from './api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserInfo()
  }, [])

  async function fetchUserInfo() {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
      setLoading(false)
    } catch (err) {
      setError('Failed to load user info')
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Interceptor handles 401; any other error — still redirect
    } finally {
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
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
        }

        body { background: var(--paper); font-family: 'DM Sans', sans-serif; }

        .dashboard-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--paper);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--cream);
          border-top: 4px solid var(--rust);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .dashboard-root {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--paper) 0%, #fdfbf8 100%);
          padding: 40px 24px;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
          padding: 0 20px;
        }

        .header-left h1 {
          font-family: 'Instrument Serif', serif;
          font-size: 44px;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .header-left p {
          font-size: 16px;
          color: var(--muted);
        }

        .header-right {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--rust) 0%, #e67e5a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-info p:first-child {
          font-weight: 600;
          color: var(--ink);
          font-size: 14px;
        }

        .user-info p:last-child {
          font-size: 12px;
          color: var(--muted);
        }

        .btn-logout {
          background: var(--rust);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-logout:hover { background: #a83218; transform: translateY(-2px); }
        .btn-logout:active { transform: translateY(0); }

        .btn-primary {
          background: linear-gradient(135deg, var(--rust) 0%, #e67e5a 100%);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-primary:hover { transform: translateY(-2px); opacity: 0.9; }
        .btn-primary:active { transform: translateY(0); }

        .btn-secondary {
          background: white;
          color: var(--rust);
          border: 2px solid var(--rust);
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-secondary:hover { background: var(--rust-light); transform: translateY(-2px); }
        .btn-secondary:active { transform: translateY(0); }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
          padding: 0 20px;
        }

        .stat-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: var(--rust);
        }

        .stat-card-icon {
          font-size: 32px;
          color: var(--rust);
          margin-bottom: 12px;
        }

        .stat-card h3 {
          font-size: 28px;
          color: var(--ink);
          margin-bottom: 4px;
          font-family: 'Instrument Serif', serif;
        }

        .stat-card p {
          font-size: 13px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        /* Activity Section */
        .activity-section {
          padding: 0 20px;
          margin-bottom: 48px;
        }

        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          color: var(--ink);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .activity-feed {
          background: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .activity-item {
          padding: 20px;
          border-bottom: 1px solid var(--cream);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: background 0.2s;
        }

        .activity-item:last-child { border-bottom: none; }
        .activity-item:hover { background: var(--cream); }

        .activity-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: var(--muted);
        }

        .activity-badge {
          display: inline-block;
          background: var(--rust-light);
          color: var(--rust);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        /* Welcome Box */
        .welcome-box {
          background: linear-gradient(135deg, var(--rust) 0%, #e67e5a 100%);
          border-radius: 14px;
          padding: 36px;
          color: white;
          margin-bottom: 48px;
          padding: 0 20px;
        }

        .welcome-box-inner {
          background: linear-gradient(135deg, var(--rust) 0%, #e67e5a 100%);
          border-radius: 14px;
          padding: 36px;
          color: white;
        }

        .welcome-box h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          margin-bottom: 12px;
        }

        .welcome-box p {
          font-size: 15px;
          opacity: 0.95;
          max-width: 600px;
          line-height: 1.5;
        }

        /* Footer */
        .dashboard-footer {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .welcome-box { padding: 0 20px; }
        }
      `}</style>

      <div className="dashboard-root">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-left">
              <h1>Dashboard</h1>
              <p>Welcome back to your workspace</p>
            </div>
            <div className="header-right">
              <div className="user-badge">
                <div className="user-avatar">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <p>{user?.username}</p>
                  <p>Active now</p>
                </div>
              </div>
              <button className="btn-primary" onClick={() => navigate('/profile')}>
                <FaEdit />
                Edit Profile
              </button>
              {user?.is_admin && (
                <button className="btn-secondary" onClick={() => navigate('/admin/users')}>
                  <FaShield />
                  Admin Panel
                </button>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </div>

          {/* Welcome Box */}
          <div className="welcome-box">
            <div className="welcome-box-inner">
              <h2>Welcome back, {user?.username}! 👋</h2>
              <p>You're all set. Explore your dashboard, check your activity, and manage your profile. Everything you need is right here.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaChartLine />
              </div>
              <h3>2,847</h3>
              <p>Total Views</p>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaUsers />
              </div>
              <h3>1,203</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaActivity />
              </div>
              <h3>94%</h3>
              <p>Engagement Rate</p>
            </div>
          </div>

          {/* Activity Section */}
          <div className="activity-section">
            <div className="section-title">
              <FaActivity />
              Recent Activity
            </div>
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-avatar">AC</div>
                <div className="activity-content">
                  <p className="activity-title">Account Created</p>
                  <p className="activity-time">Welcome to Northgate! Your account is now active.</p>
                </div>
                <span className="activity-badge">NEW</span>
              </div>
              <div className="activity-item">
                <div className="activity-avatar" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>PP</div>
                <div className="activity-content">
                  <p className="activity-title">Profile Verified</p>
                  <p className="activity-time">Your email has been verified and your profile is complete.</p>
                </div>
                <span className="activity-badge" style={{background: '#d4edda', color: '#155724'}}>VERIFIED</span>
              </div>
              <div className="activity-item">
                <div className="activity-avatar" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>SU</div>
                <div className="activity-content">
                  <p className="activity-title">Security Updated</p>
                  <p className="activity-time">Your secure session has been established with encryption.</p>
                </div>
                <span className="activity-badge" style={{background: '#cfe2ff', color: '#084298'}}>SECURE</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="dashboard-footer">
            <p>© 2026 Northgate. All rights reserved. Made with ❤️</p>
          </div>
        </div>
      </div>
    </>
  )
}