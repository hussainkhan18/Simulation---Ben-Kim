# Deployment Guide

Complete step-by-step guide to deploy your Strategic Crisis Simulation Platform to production.

## 🎯 Deployment Stack

- **Frontend**: Vercel (Free tier)
- **Backend**: Railway (Free tier with credit card) or Render (Free tier)
- **Database**: Supabase (Free tier)

Total cost: **$0/month** on free tiers (sufficient for portfolio/demo)

---

## 1️⃣ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Click "New Project"
5. Choose organization name
6. Project settings:
   - **Name**: `crisis-simulation`
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your target users
   - **Pricing Plan**: Free

### Step 2: Set Up Database Schema

1. Wait for project to initialize (~2 minutes)
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy entire contents of `database/schema.sql`
5. Paste into query editor
6. Click **RUN** (or press Cmd/Ctrl + Enter)
7. Verify success message

### Step 3: Get Connection String

1. Go to **Settings** > **Database** (left sidebar)
2. Scroll to **Connection String**
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Save this - you'll need it for backend deployment

Example format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 2️⃣ Backend Deployment (Railway)

### Step 1: Prepare for Deployment

1. Create a GitHub repository for your project
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit: Crisis Simulation Platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Select your repository
6. Railway will auto-detect Node.js

### Step 3: Configure Environment Variables

1. In Railway dashboard, click on your service
2. Go to **Variables** tab
3. Add these variables:
   - `PORT` = `3001`
   - `DATABASE_URL` = Your Supabase connection string
   - `NODE_ENV` = `production`

### Step 4: Configure Build Settings

1. Go to **Settings** tab
2. **Start Command**: `node server.js`
3. **Build Command**: Leave empty (no build needed)
4. Click **"Deploy"**

### Step 5: Get Your Backend URL

1. Go to **Settings** tab
2. Under **Networking** > **Public Networking**
3. Click **"Generate Domain"**
4. Copy your domain (e.g., `crisis-sim-backend.up.railway.app`)
5. **SAVE THIS** - you need it for frontend

---

## 3️⃣ Frontend Deployment (Vercel)

### Step 1: Update API URL

1. Open `frontend/src/App.js`
2. Find this line:
```javascript
const API_URL = 'http://localhost:3001/api';
```
3. Replace with:
```javascript
const API_URL = 'https://YOUR-RAILWAY-DOMAIN.railway.app/api';
```
4. Commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New..."** > **"Project"**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Click **"Deploy"**

### Step 3: Get Your Frontend URL

1. Wait for deployment to complete (~2 minutes)
2. Vercel will give you a URL like: `crisis-simulation.vercel.app`
3. Visit the URL to test your app!

---

## 4️⃣ Configure CORS (Important!)

Your backend needs to accept requests from your frontend domain.

### Update Backend CORS

1. Open `server.js`
2. Find this section:
```javascript
const cors = require('cors');
app.use(cors());
```

3. Replace with:
```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://YOUR-VERCEL-DOMAIN.vercel.app'
  ],
  credentials: true
}));
```

4. Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

5. Railway will auto-deploy the update

---

## 5️⃣ Testing Your Deployment

### Health Check

1. Test backend health:
   - Visit: `https://your-backend.railway.app/api/health`
   - Should see: `{"status":"ok","sessions":0}`

2. Test frontend:
   - Visit: `https://your-app.vercel.app`
   - Click "Start Simulation"
   - Should load a scenario

### Full Simulation Test

1. Start a simulation
2. Make 2-3 decisions
3. Complete simulation
4. Review feedback report
5. Verify all features work

---

## 6️⃣ Custom Domain (Optional)

### For Frontend (Vercel)

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel dashboard > Settings > Domains
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (~1 hour)

### For Backend (Railway)

1. In Railway dashboard > Settings > Public Networking
2. Add custom domain
3. Add CNAME record in your DNS provider
4. Wait for SSL certificate

---

## 7️⃣ Monitoring & Maintenance

### Railway (Backend)

- **Logs**: Available in Railway dashboard
- **Metrics**: CPU, Memory, Network usage
- **Restarts**: Automatic on code push

### Vercel (Frontend)

- **Analytics**: Built-in in Vercel dashboard
- **Deployments**: Every git push creates new deployment
- **Rollback**: Instant rollback to any previous deployment

### Supabase (Database)

- **Dashboard**: Monitor database size, connections
- **Backups**: Automatic daily backups on free tier
- **Logs**: SQL query logs available

---

## 8️⃣ Cost Breakdown

### Free Tier Limits

**Supabase Free Tier:**
- 500 MB database
- 1 GB file storage
- 50 MB file uploads
- 2 GB data transfer
- **More than enough for a portfolio project**

**Railway Free Tier:**
- $5 credit/month (requires credit card)
- ~500 hours/month
- **Sufficient for demo/portfolio**

**Vercel Free Tier:**
- Unlimited deployments
- 100 GB bandwidth
- Serverless function executions
- **Perfect for portfolio**

---

## 9️⃣ Troubleshooting

### Backend won't start

**Problem**: Railway shows "crashed"

**Solutions**:
1. Check environment variables are set correctly
2. Verify `PORT` variable exists
3. Check Railway logs for error messages
4. Ensure `package.json` has correct start script

### Frontend can't connect to backend

**Problem**: "Failed to fetch" errors

**Solutions**:
1. Verify backend URL in `App.js` is correct
2. Check CORS configuration in backend
3. Ensure backend is running (check Railway status)
4. Open browser console to see exact error

### Database connection fails

**Problem**: Backend shows database errors

**Solutions**:
1. Verify connection string format
2. Check password has no special characters issues
3. Ensure Supabase project is active
4. Test connection from Railway logs

---

## 🎉 Success!

Your app is now live! Share these URLs:

- **Live App**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **Database**: Supabase Dashboard

---

## 📋 Pre-Launch Checklist

- [ ] Database schema created in Supabase
- [ ] Backend deployed to Railway
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] API URL updated in frontend
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] Full simulation test completed
- [ ] All features working end-to-end

---

## 🔗 Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **GitHub Repo**: Your repository URL

---

## 💡 Tips for Portfolio Presentation

1. **Create a 30-second demo video** showing the full flow
2. **Screenshot the feedback report** - it's the most impressive part
3. **Mention the tech stack** in your portfolio description
4. **Emphasize the stochastic system** - "infinite unique scenarios"
5. **Highlight behavioral analysis** - "bias detection engine"

---

Need help? Check Railway logs, Vercel deployment logs, or Supabase query logs for detailed error messages.
