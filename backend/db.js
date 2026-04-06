// db.js
// Exports a single shared connection pool.
// Never call mysql.createConnection() per-request — always use this pool.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,   // Queue requests instead of failing immediately
  connectionLimit:    10,     // Max concurrent connections
  queueLimit:         0,      // Unlimited queue (0 = no limit)
  enableKeepAlive:    true,   // Prevent idle connection drops
  keepAliveInitialDelay: 0,
});

// Verify the pool can connect on startup
pool.getConnection()
  .then(conn => {
    console.log('[DB] Connection pool established successfully.');
    conn.release();
  })
  .catch(err => {
    console.error('[DB] Failed to establish connection pool:', err.message);
    process.exit(1); // Fatal: don't start the server without a DB
  });

export default pool;