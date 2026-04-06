// authController.js
// Handles: register, login, logout, profile, password reset, and admin operations

import bcrypt       from 'bcryptjs';
import jwt          from 'jsonwebtoken';
import crypto       from 'crypto';
import pool         from './db.js';
import dotenv       from 'dotenv';
import nodemailer   from 'nodemailer';

dotenv.config();

const SALT_ROUNDS   = 12;
const COOKIE_NAME   = 'auth_token';

// Configure email transporter (for password reset emails)
// For local/development, we can use a test account or suppress emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost',
  port: process.env.EMAIL_PORT || 1025,
  secure: false,
  auth: process.env.EMAIL_USER ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  } : undefined,
  logger: false,
  debug: false
});

// Derive a SHA-256 hash of the raw JWT string.
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Build a consistent httpOnly cookie option object.
function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge:   maxAgeMs,
  };
}

// Generate a secure reset token
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
export async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }
    console.error('[register] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error.', details: err.message });
  }
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];

    // SECURITY: Run bcrypt.compare even when the user doesn't exist.
    // This prevents timing-based user enumeration attacks by ensuring
    // the response time is consistent whether or not the user was found.
    const dummyHash = '$2b$12$invalidhashusedtoblindtimingattacks000000000000000000000';
    const passwordToCompare = user ? user.password : dummyHash;
    const isMatch = await bcrypt.compare(password, passwordToCompare);

    if (!user || !isMatch) {
      // Generic error — never reveal which part failed (anti-enumeration)
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Sign a JWT (short-lived: 15 minutes)
    const expiresInSec = 15 * 60; // 15 minutes in seconds
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: expiresInSec }
    );

    // Set the JWT in a secure httpOnly cookie
    res.cookie(COOKIE_NAME, token, cookieOptions(expiresInSec * 1000));

    return res.status(200).json({
      message: 'Login successful.',
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export async function logout(req, res) {
  // req.token and req.tokenPayload are attached by the authenticate middleware
  const { token, tokenPayload } = req;

  try {
    const tokenHash = hashToken(token);
    const expiresAt  = new Date(tokenPayload.exp * 1000); // JWT exp is in seconds

    // 1. Blacklist this specific token so it can never be reused
    await pool.execute(
      'INSERT IGNORE INTO TokenBlacklist (token_hash, expires_at) VALUES (?, ?)',
      [tokenHash, expiresAt]
    );

    // 2. LAZY JANITOR: Delete all already-expired tokens while we're here.
    //    This runs asynchronously — we don't await it so logout stays fast.
    pool.execute('DELETE FROM TokenBlacklist WHERE expires_at < NOW()')
      .then(([result]) => {
        if (result.affectedRows > 0) {
          console.log(`[janitor] Cleaned up ${result.affectedRows} expired token(s).`);
        }
      })
      .catch(err => console.error('[janitor] Cleanup error:', err.message));

    // 3. Clear the cookie on the client
    res.clearCookie(COOKIE_NAME, cookieOptions(0));

    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('[logout]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── PROTECTED ROUTE EXAMPLE ─────────────────────────────────────────────────
export async function getMe(req, res) {
  // req.user is attached by the authenticate middleware after token validation
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, bio, avatar_color, is_admin, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (!rows[0]) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({
      message: 'Token is valid.',
      user: rows[0],
    });
  } catch (err) {
    console.error('[getMe]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
export async function updateProfile(req, res) {
  const { bio, avatar_color } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    await pool.execute(
      'UPDATE users SET bio = ?, avatar_color = ? WHERE id = ?',
      [bio || '', avatar_color || '#3B82F6', req.user.userId]
    );

    const [rows] = await pool.execute(
      'SELECT id, username, email, bio, avatar_color, is_admin FROM users WHERE id = ?',
      [req.user.userId]
    );

    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: rows[0],
    });
  } catch (err) {
    console.error('[updateProfile]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── REQUEST PASSWORD RESET ──────────────────────────────────────────────────
export async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    // SECURITY: Don't reveal if user exists
    if (!user) {
      // Return success even if user doesn't exist (anti-enumeration)
      return res.status(200).json({ 
        message: 'If email exists, password reset link has been sent.' 
      });
    }

    // Generate a reset token (valid for 1 hour)
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    await pool.execute(
      'UPDATE users SET password_reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, resetTokenExpires, user.id]
    );

    // In production, send actual email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // For development, just log it
    console.log(`[passwordReset] Reset link for ${email}: ${resetUrl}`);

    // Try to send email (but don't fail if it doesn't work in dev)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@auth.app',
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 1 hour.</p>`,
      });
    } catch (emailErr) {
      console.warn('[passwordReset] Email send failed (dev mode):', emailErr.message);
      // Don't fail the request if email sending fails
    }

    return res.status(200).json({ 
      message: 'If email exists, password reset link has been sent.',
      // For development only - remove in production!
      devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    });
  } catch (err) {
    console.error('[requestPasswordReset]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── VERIFY & RESET PASSWORD ─────────────────────────────────────────────────
export async function resetPassword(req, res) {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, email FROM users WHERE password_reset_token = ? AND reset_token_expires > NOW()',
      [resetToken]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired reset token.' });
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password and clear reset token
    await pool.execute(
      'UPDATE users SET password = ?, password_reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hash, user.id]
    );

    return res.status(200).json({ message: 'Password reset successfully. Please login.' });
  } catch (err) {
    console.error('[resetPassword]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── LIST ALL USERS (ADMIN ONLY) ─────────────────────────────────────────────
export async function listAllUsers(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    // Check if user is admin
    const [userRows] = await pool.execute(
      'SELECT is_admin FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Get all users (paginated)
    const limit = Math.max(1, parseInt(req.query.limit) || 50);
    const offset = Math.max(0, parseInt(req.query.offset) || 0);

    const [rows] = await pool.execute(
      `SELECT id, username, email, bio, avatar_color, is_admin, created_at FROM users ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM users');

    return res.status(200).json({
      users: rows,
      total: countRows[0].total,
      limit,
      offset,
    });
  } catch (err) {
    console.error('[listAllUsers]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── DELETE USER (ADMIN ONLY) ────────────────────────────────────────────────
export async function deleteUser(req, res) {
  const { userId } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // Check if requester is admin
    const [adminRows] = await pool.execute(
      'SELECT is_admin FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!adminRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Prevent self-deletion
    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }

    // Delete the user
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('[deleteUser]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// ─── SET ADMIN STATUS (ADMIN ONLY) ───────────────────────────────────────────
export async function setAdminStatus(req, res) {
  const { userId, isAdmin } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  if (!userId || isAdmin === undefined) {
    return res.status(400).json({ error: 'User ID and admin status are required.' });
  }

  try {
    // Check if requester is admin
    const [adminRows] = await pool.execute(
      'SELECT is_admin FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!adminRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Update admin status
    await pool.execute(
      'UPDATE users SET is_admin = ? WHERE id = ?',
      [isAdmin ? 1 : 0, userId]
    );

    return res.status(200).json({ message: 'Admin status updated successfully.' });
  } catch (err) {
    console.error('[setAdminStatus]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}