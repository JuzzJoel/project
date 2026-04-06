# 🚀 Local Hosting & Database Guide

## 📋 Current Setup Overview

Your application consists of:
- **Frontend:** React + Vite (http://localhost:5173)
- **Backend:** Node.js + Express (http://localhost:5000)
- **Database:** MySQL (Docker container on localhost:3306)

---

## 🏃 Running Everything Locally

### Prerequisites
Make sure you have:
- Node.js & npm/pnpm installed
- Docker & Docker Desktop running
- Port 5000, 5173, and 3306 available

### Step 1: Start the Database (if not running)
```bash
docker-compose up -d
```

Verify it's running:
```bash
docker ps | grep auth_mysql
```

### Step 2: Start the Backend Server
```bash
cd backend
pnpm dev
# or: node server.js
```

Expected output:
```
[server] Running on http://localhost:5000
[DB] Connection pool established successfully.
```

### Step 3: Start the Frontend Development Server
```bash
cd frontend
pnpm dev
```

Expected output:
```
  VITE v8.0.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Access Your App
- **Frontend:** Open http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## 🗄️ Viewing & Managing the Database

### Option 1: Using MySQL Command Line (Terminal)

#### View all users:
```bash
docker exec -it auth_mysql mysql -uroot -p'fuck_yall_niggas' auth_db -e "SELECT id, username, email, created_at FROM users;"
```

#### View specific user:
```bash
docker exec -it auth_mysql mysql -uroot -p'fuck_yall_niggas' auth_db -e "SELECT * FROM users WHERE username='yourname';"
```

#### Count total users:
```bash
docker exec -it auth_mysql mysql -uroot -p'fuck_yall_niggas' auth_db -e "SELECT COUNT(*) as total_users FROM users;"
```

#### Delete all users (reset):
```bash
docker exec -it auth_mysql mysql -uroot -p'fuck_yall_niggas' auth_db -e "DELETE FROM users;"
```

---

### Option 2: Using MySQL Workbench (GUI - Recommended)

#### Install MySQL Workbench:
- Download from: https://dev.mysql.com/downloads/workbench/
- Install and open it

#### Create a Connection:
1. Click **"Database"** → **"Manage Connections"**
2. Click **"New"** button
3. Fill in:
   - **Connection Name:** `localhost-auth`
   - **Connection Method:** TCP/IP
   - **Hostname:** `127.0.0.1`
   - **Port:** `3306`
   - **Username:** `root`
   - **Password:** `fuck_yall_niggas`
   - **Default Schema:** `auth_db`
4. Click **"Test Connection"** → Should say "Successfully made the MySQL connection"
5. Click **"OK"** to save

#### Browse Data:
1. Double-click the connection to open it
2. In the left panel, expand **Schemas** → **auth_db** → **Tables**
3. Right-click **users** → **Select Rows (Limit 1000)**
4. View all registered users, their emails, and registration dates

---

### Option 3: Using DBeaver (Free, Powerful)

#### Install DBeaver:
- Download from: https://dbeaver.io/download/
- Install Community Edition

#### Create a Connection:
1. Click **Database** → **New Database Connection**
2. Select **MySQL** → **Next**
3. Fill in:
   - **Server Host:** `127.0.0.1`
   - **Port:** `3306`
   - **Database:** `auth_db`
   - **Username:** `root`
   - **Password:** `fuck_yall_niggas`
4. Click **Finish**
5. Double-click the connection to browse

---

### Option 4: Using phpMyAdmin (Web-Based)

#### Start phpMyAdmin container:
```bash
docker run --name phpmyadmin \
  -e PMA_HOST=host.docker.internal \
  -e PMA_USER=root \
  -e PMA_PASSWORD='fuck_yall_niggas' \
  -p 8080:80 \
  phpmyadmin &
```

#### Access it:
- Open http://localhost:8080
- Login with:
  - **Username:** `root`
  - **Password:** `fuck_yall_niggas`
- Select **auth_db** database from left panel
- Click **users** table to view/edit users

---

## 🗄️ Database Schema

### users table structure:
```
┌────┬──────────────┬────────────────┬──────────┬────────────┬───────────────┐
│ id │   username   │     email      │ password │ created_at │   updated_at  │
├────┼──────────────┼────────────────┼──────────┼────────────┼───────────────┤
│ 1  │ johndoe      │ john@mail.com  │ $2b$12$* │ 2026-04-06 │  2026-04-06  │
│ 2  │ jane_smith   │ jane@mail.com  │ $2b$12$* │ 2026-04-06 │  2026-04-06  │
└────┴──────────────┴────────────────┴──────────┴────────────┴───────────────┘

- password: Bcrypt-hashed (NOT plaintext)
- created_at: Timestamp of registration
- updated_at: Last modified timestamp
```

---

## 🔧 Common Tasks

### View Database Logs
```bash
docker logs auth_mysql -f
```

### Stop Database
```bash
docker-compose down
```

### Reset Everything (Remove All Data)
```bash
docker-compose down -v
docker-compose up -d
```

### Check Backend Logs (in real-time)
The terminal where you ran `pnpm dev` in backend shows logs automatically.

### Test API Endpoints

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Get user info:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Cookie: auth_token=YOUR_TOKEN_HERE"
```

---

## 📊 Useful MySQL Queries

### Count active users:
```sql
SELECT COUNT(*) as active_users FROM users;
```

### Find user by email:
```sql
SELECT * FROM users WHERE email LIKE '%@example.com';
```

### Sort users by registration date (newest first):
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### Get users registered in last 24 hours:
```sql
SELECT * FROM users 
WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY);
```

### Update user email:
```sql
UPDATE users SET email='newemail@test.com' WHERE username='john';
```

---

## 🌐 Production Deployment (Optional)

When ready to deploy to the internet:

### Frontend:
```bash
cd frontend
pnpm build
# Deploy the "dist" folder to Vercel, Netlify, or similar
```

### Backend:
Host on Heroku, Railway, or AWS:
```bash
# Build for production
npm run build
# Deploy with your hosting provider
```

### Database:
Use cloud MySQL like:
- Amazon RDS
- Google Cloud SQL
- Azure Database for MySQL
- PlanetScale (free tier available)

---

## 🆘 Troubleshooting

**"Connection refused" on localhost:5000?**
- Backend not running. Check if process is alive: `netstat -an | grep 5000`
- Restart backend: `cd backend && pnpm dev`

**"Database connection error"?**
- Docker container not running: `docker-compose up -d`
- Wrong credentials in .env file
- MySQL port 3306 already in use

**"Cannot see new users in database"?**
- Refresh browser or run query again
- Check registration was successful in frontend console (F12)

**"Forgot database password"?**
- It's in `backend/.env`: `DB_PASSWORD=fuck_yall_niggas`
- Or reset with: `docker-compose down -v && docker-compose up -d`

---

## 📝 Summary Checklist

- [ ] Docker running (`docker-compose up -d`)
- [ ] Backend running (`cd backend && pnpm dev`)
- [ ] Frontend running (`cd frontend && pnpm dev`)
- [ ] Access app at http://localhost:5173
- [ ] Can login/register successfully
- [ ] Can view database via MySQL Workbench or CLI
- [ ] Users appear in database after registration

You're all set! 🎉
