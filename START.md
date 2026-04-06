# ⚡ Quick Start Guide

## 🚀 Start Everything in 3 Steps

### Step 1: Start Docker containers (MySQL + phpMyAdmin)
```bash
docker-compose up -d
```

### Step 2: Start Backend (in new terminal)
```bash
cd backend
pnpm dev
```

### Step 3: Start Frontend (in another new terminal)
```bash
cd frontend
pnpm dev
```

---

## ✅ Verify Everything is Running

After starting all three, you should have:

| What | URL | What to do |
|------|-----|-----------|
| **Frontend App** | http://localhost:5173 | Open in browser, register/login |
| **phpMyAdmin** | http://localhost:8080 | View database in web UI |
| **Backend API** | http://localhost:5000 | Handles requests (runs in background) |
| **Database** | localhost:3306 | MySQL runs in Docker |

---

## 🎯 First Time Setup

**Open 3 terminals:**
```
Terminal 1:                    Terminal 2:                 Terminal 3:
$ docker-compose up -d        $ cd backend              $ cd frontend
                              $ pnpm dev                $ pnpm dev
[mysql running]               [server on 5000]          [dev server on 5173]
[phpmyadmin running]          [waiting for requests]    [app loaded]
```

Then open http://localhost:5173 in your browser!

---

## 📊 View Database

**For a web UI (easiest):**
→ Open http://localhost:8080
→ Login with:
  - User: `root`
  - Password: `fuck_yall_niggas`
→ Click `auth_db` database
→ You'll see all your registered users!

---

## 🛑 Stop Everything

```bash
# Stop Database/phpMyAdmin
docker-compose down

# Stop Backend/Frontend
# Just press Ctrl+C in Terminal 2 and 3
```

---

## 🔧 Troubleshooting

**Port 5173 already in use?**
```bash
# Find what's using it
netstat -ano | findstr :5173
# Stop the process or restart
```

**Docker not running?**
- Open Docker Desktop app first, then try `docker-compose up -d`

**Database connection error?**
```bash
# Reset everything
docker-compose down -v
docker-compose up -d
```

---

See `LOCAL_HOSTING_GUIDE.md` for detailed instructions and advanced options! 📚
