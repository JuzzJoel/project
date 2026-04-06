# 🚀 Deployment Guide: Frontend to Vercel

## What You'll Deploy
- React/Vite application
- Connects to backend API at a production URL
- Hosted globally with CDN

---

## Step-by-Step Deployment to Vercel

### 1. Create a GitHub Repository (if you haven't already)

```bash
cd c:\Users\user\project
git init
git add .
git commit -m "Initial auth app"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Sign Up on Vercel
- Go to [vercel.com](https://vercel.com)
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Vercel access to your GitHub

### 3. Import Your Project
- On Vercel dashboard, click "**+ New Project**"
- Select your repository from GitHub
- Keep default settings mostly the same, but:
  - **Framework:** Vite
  - **Root Directory:** `./frontend`
  - Click **Deploy**

### 4. Set Environment Variables
After deployment, configure API URL:
- Go to your project on Vercel
- Click **Settings** → **Environment Variables**
- Add a new variable:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://YOUR_BACKEND_URL` (e.g., `https://auth-app-backend.railway.app`)
  - Click **Save**

### 5. Redeploy
- Go to **Deployments**
- Click the latest deployment
- Click **Redeploy** to apply environment variables

### 6. Update Frontend Code (if not already done)

Update [frontend/src/api.js](frontend/src/api.js):
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Make sure to use this instead of hardcoded localhost.

---

## Vercel Production URL
Once deployed, your app will be at:
```
https://YOUR_PROJECT_NAME.vercel.app
```

---

## Troubleshooting Vercel Deployment

**"SyntaxError: Unexpected token"**
- Make sure all React components are valid JSX
- Check for missing imports (like React)

**"Cannot GET /path"**
- This is normal for SPA. Configure `vercel.json`:
```json
{
  "buildCommand": "cd frontend && pnpm build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**"CORS error in production"**
- Make sure backend has frontend URL in CORS config
- Check FRONTEND_URL environment variable on backend

---

## Tips
✅ Vercel automatically rebuilds when you push to GitHub  
✅ Preview deployments on every pull request  
✅ Free tier includes unlimited deployments  
✅ Use GitHub Actions for CI/CD  

Next: Deploy backend to Railway!
