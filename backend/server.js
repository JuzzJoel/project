// server.js

import express              from 'express';
import cookieParser         from 'cookie-parser';
import cors                 from 'cors';
import dotenv               from 'dotenv';
import { register, login, logout, getMe, updateProfile, requestPasswordReset, resetPassword, listAllUsers, deleteUser, setAdminStatus } from './authController.js';
import { authenticate }     from './middleware.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ──────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:      'http://localhost:5173',
  credentials: true,
}));

// ── Public Routes ──────────────────────────────────────────────────────────
app.post('/api/auth/register',              register);
app.post('/api/auth/login',                 login);
app.post('/api/auth/request-password-reset', requestPasswordReset);
app.post('/api/auth/reset-password',        resetPassword);

// ── Protected Routes (authenticate middleware guards these) ────────────────
app.post('/api/auth/logout',                authenticate, logout);
app.get('/api/auth/me',                     authenticate, getMe);
app.put('/api/auth/profile',                authenticate, updateProfile);

// ── Admin Routes ───────────────────────────────────────────────────────────
app.get('/api/admin/users',                 authenticate, listAllUsers);
app.post('/api/admin/users/delete',         authenticate, deleteUser);
app.post('/api/admin/users/set-admin',      authenticate, setAdminStatus);

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});