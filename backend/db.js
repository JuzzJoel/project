import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Debug: Log what Railway provides (remove in production)
console.log('Railway MySQL Variables:', {
  MYSQLHOST: process.env.MYSQLHOST,
  MYSQLPORT: process.env.MYSQLPORT,
  MYSQLUSER: process.env.MYSQLUSER,
  MYSQLDATABASE: process.env.MYSQLDATABASE,
  hasPassword: !!process.env.MYSQLPASSWORD,
  hasUrl: !!process.env.MYSQL_URL
});

// Create connection pool based on what Railway provides
let pool;

if (process.env.MYSQL_URL) {
  // Option 1: Use Railway's MYSQL_URL (recommended)
  console.log('[DB] Using MYSQL_URL connection');
  pool = mysql.createPool({
    uri: process.env.MYSQL_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else if (process.env.MYSQLHOST) {
  // Option 2: Use individual Railway variables
  console.log('[DB] Using individual Railway MySQL variables');
  pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: parseInt(process.env.MYSQLPORT) || 3306,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else if (process.env.DATABASE_URL) {
  // Option 3: Standard DATABASE_URL
  console.log('[DB] Using DATABASE_URL connection');
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  // Option 4: Local development
  console.log('[DB] Using local development configuration');
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'auth_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Test the connection
try {
  const connection = await pool.getConnection();
  console.log('[DB] ✅ Connected successfully to MySQL');
  connection.release();
} catch (err) {
  console.error('[DB] ❌ Connection failed:', err.message);
  console.error('[DB] Full error:', err);
  // Don't exit - let the app try to recover
}

export default pool;