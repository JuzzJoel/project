import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ UPDATED CORS - Allow Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',           // Local development
  'https://project-auth-app-alpha.vercel.app',  // Your production frontend
  /\.vercel\.app$/                   // Allow all Vercel preview deployments
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => 
      allowed === origin || (allowed instanceof RegExp && allowed.test(origin))
    )) {
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(cookieParser());
app.use(express.json());

// ✅ ADD A TEST ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running', status: 'online' });
});

// ✅ HEALTH CHECK ENDPOINT
app.get('/api/health', async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();
    res.status(200).json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// ✅ LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Your login logic here
    // This is a placeholder - implement your actual login
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password, generate JWT, set cookie, etc.
    res.json({ message: 'Login successful', user: { username } });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Your registration logic here
    // This is a placeholder
    await db.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
  console.log(`[server] Environment: ${process.env.NODE_ENV}`);
  console.log(`[server] Allowing CORS for:`, allowedOrigins);
});