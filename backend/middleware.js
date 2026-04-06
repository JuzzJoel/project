// middleware.js
// authenticate: validates JWT from the httpOnly cookie.
// Flow: extract token → check blacklist → verify signature → attach user to req

import jwt    from 'jsonwebtoken';
import crypto from 'crypto';
import pool   from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const COOKIE_NAME = 'auth_token';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function authenticate(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    // ── Step 1: Check the server-side blacklist ────────────────────────────
    // We check BEFORE verifying the signature to immediately reject
    // tokens that were explicitly invalidated via logout.
    const tokenHash = hashToken(token);

    const [rows] = await pool.execute(
      'SELECT id FROM TokenBlacklist WHERE token_hash = ?',
      [tokenHash]
    );

    if (rows.length > 0) {
      // Token was blacklisted (user logged out) — treat as unauthorized
      return res.status(401).json({ error: 'Token has been revoked. Please log in again.' });
    }

    // ── Step 2: Verify the JWT signature and expiry ───────────────────────
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the raw token and decoded payload to the request object
    // so downstream handlers (e.g., logout) can use them without re-parsing.
    req.token        = token;
    req.tokenPayload = payload;
    req.user         = { userId: payload.userId, username: payload.username };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    console.error('[authenticate]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}