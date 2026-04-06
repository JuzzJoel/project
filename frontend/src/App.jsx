import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './LoginForm.jsx'
import RegisterForm from './RegisterForm.jsx'
import Dashboard from './Dashboard.jsx'
import ProfileEdit from './ProfileEdit.jsx'
import ForgotPassword from './ForgotPassword.jsx'
import ResetPassword from './ResetPassword.jsx'
import AdminUsers from './AdminUsers.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfileEdit />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}