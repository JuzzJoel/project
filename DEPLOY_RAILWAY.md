# 🚀 Deployment Guide: Backend to Railway

## What You'll Deploy
- Node.js/Express API server
- MySQL database (or use Railway's PostgreSQL)
- Running 24/7 with automatic restarts

---

## Step-by-Step Deployment to Railway

### 1. Create GitHub Repository (if you haven't already)
```bash
cd c:\Users\user\project
git init
git add .
git commit -m "Initial auth app with backend"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Sign Up on Railway
- Go to [railway.app](https://railway.app)
- Click **"Start a New Project"**
- Click **"Deploy from GitHub repo"**
- Authorize Railway and select your repository

### 3. Configure Railway Service

Railway will create a basic service. Now configure:

1. **Create MySQL Database Service**
   - In Railway dashboard, click **"+ New"** → **"Database"** → **"MySQL"**
   - Railway automatically creates `DATABASE_URL` environment variable
   - Copy the MySQL credentials shown

2. **Configure Backend Service**
   - Click on your backend service
   - Go to **Settings**
   - Set **Root Directory:** `backend`
   - Set **Start Command:** `npm start` (or `pnpm start`)

3. **Add Environment Variables**
   - In your service, click **Variables**
   - Add from your `.env` file:
   ```
   NODE_ENV=production
   PORT=8080
   DB_HOST=<railway-mysql-host>
   DB_PORT=3306
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=auth_db
   JWT_SECRET=<your-jwt-secret>
   FRONTEND_URL=https://YOUR_FRONTEND_URL.vercel.app
   EMAIL_FROM=noreply@yourappname.com
   ```

4. **Deploy**
   - Railway automatically deploys on push to main
   - Watch the logs in Railway dashboard

### 4. Get Your Production Backend URL
- In Railway dashboard, click your service
- Look for **"Domains"** section
- You'll see: `https://railway-app-name.railway.app` or similar
- This is your backend API URL

### 5. Update MySQL Connection
Since Railway provides DATABASE_URL, update [backend/db.js](backend/db.js):

```javascript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  // Option 1: Parse DATABASE_URL from Railway
  ...(process.env.DATABASE_URL && {
    connectionUri: process.env.DATABASE_URL,
    connectionParams: {
      multipleStatements: false,
    }
  }) ||
  // Option 2: Use individual env vars (local)
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
});

pool.getConnection()
  .then(() => console.log('[DB] Connection pool established successfully.'))
  .catch((err) => {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  });

export default pool;
```

---

##Backend Production URL
```
https://YOUR-RAILWAY-APP.railway.app
```

---

## Key Railway Features
✅ **GitHub Integration:** Push to auto-deploy  
✅ **Auto SSL:** HTTPS included  
✅ **Auto Scaling:** Handles traffic spikes  
✅ **Free Tier:** $5 credit/month  
✅ **Database Backups:** Automatic  
✅ **Environment Variables:** Easy management  

---

## Troubleshooting Railway Deployment

**"Cannot connect to database"**
- Check DATABASE_URL format
- Ensure DB exists: `CREATE DATABASE auth_db;`
- Verify MySQL user has permissions

**"Port already in use"**
- Railway assigns port automatically via $PORT env var
- Update [backend/server.js](backend/server.js):
```javascript
const PORT = process.env.PORT || 5000;
```

**"CORS errors"**
- Add frontend domain to CORS whitelist
- Update [backend/server.js](backend/server.js):
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true,
}));
```

**"502 Bad Gateway"**
- Check application logs in Railway dashboard
- Look for startup errors
- Ensure start command is correct

---

## Run Database Migrations

SSH into Railway and create database schema:

```bash
# Via Railway CLI
railway sh

# Then run migrations
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < init.sql
```

Or use a migration service hook in your app.

---

## Final Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] Database migrations run
- [ ] CORS configured for frontend domain
- [ ] Password reset emails working (in production)
- [ ] All endpoints tested with `/` → `/api/auth/login`
- [ ] User registration → Profile editing → Admin dashboard works

---

## Production URLs
```
Frontend: https://your-app.vercel.app
Backend API: https://your-backend.railway.app
Database: Hosted on Railway MySQL
```

**You're live! 🎉**
