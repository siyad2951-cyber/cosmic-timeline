# 🚀 Cosmic Timeline — Complete Deployment Guide

> **Stack:** Node.js/Express Backend → Render | Vite/JS Frontend → Vercel
> **Backend Live URL:** https://cosmic-timeline-5csl.onrender.com
> **Last Updated:** March 2026

---

## 📁 Project Structure

```
Cosmic-Timeline/
├── backend/               ← Node.js + Express API
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── data/
│   └── package.json
├── frontend/              ← Vite Vanilla JS App
│   ├── index.html
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── vercel.json        ← SPA routing fix
│   └── package.json
├── render.yaml            ← Render auto-deploy config
├── vercel.json            ← Vercel root config
└── DEPLOYMENT_GUIDE_FINAL.md
```

---

## 🖥️ Part 1: Run Locally (Development)

### Step 1 — Clone the repo
```bash
git clone https://github.com/siyad2951/cosmic-timeline.git
cd cosmic-timeline
```

### Step 2 — Set up Backend `.env`
Create `backend/.env` with:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
NASA_API_KEY=DEMO_KEY
```
> Get a free NASA API key at: https://api.nasa.gov (gives 1000 req/hr vs 30 with DEMO_KEY)

### Step 3 — Set up Frontend `.env`
Create `frontend/.env` with:
```env
VITE_API_URL=http://localhost:3000/api
```

### Step 4 — Install & Start Backend
Open **Terminal 1:**
```bash
cd backend
npm install
npm run dev
```
✅ You should see: `🚀 Server running on port 3000`

### Step 5 — Install & Start Frontend
Open **Terminal 2:**
```bash
cd frontend
npm install
npm run dev
```
✅ You should see: `VITE v5.x.x  ready in 261 ms`
✅ Open browser at: **http://localhost:5173**

### Step 6 — Test Backend Health
Open browser at: **http://localhost:3000/api/health**
```json
{ "status": "healthy", "uptime": 10, "version": "1.0.0" }
```

---

## ☁️ Part 2: Deploy Backend to Render

### Step 1 — Go to Render Dashboard
👉 https://dashboard.render.com → Sign in with GitHub

### Step 2 — Create New Web Service
- Click **New +** → **Web Service**
- Click **Connect a repository**
- Select your `cosmic-timeline` GitHub repo
- Click **Connect**

### Step 3 — Configure the Service
| Field            | Value                       |
|------------------|-----------------------------|
| Name             | `cosmic-timeline-backend`   |
| **Root Directory** | `backend`  ← IMPORTANT!  |
| Environment      | `Node`                      |
| Region           | Oregon (US West)            |
| Branch           | `main`                      |
| Build Command    | `npm install`               |
| Start Command    | `npm start`                 |
| Instance Type    | `Free`                      |

### Step 4 — Add Environment Variables
Click **Advanced** → Add each variable:

| Key            | Value                              |
|----------------|------------------------------------|
| `NODE_ENV`     | `production`                       |
| `PORT`         | `3000`                             |
| `NASA_API_KEY` | `DEMO_KEY`                         |
| `FRONTEND_URL` | `https://your-app.vercel.app`      |

> ⚠️ Replace `your-app.vercel.app` with your actual Vercel URL after deploying frontend!

### Step 5 — Deploy
- Click **Create Web Service**
- Wait 2-4 minutes for build to finish
- Watch logs for: `🚀 Server running on port 3000`

### Step 6 — Get Your Backend URL
Top-left of the service page, copy your URL:
```
https://cosmic-timeline-5csl.onrender.com
```

### Step 7 — Test It
Open in browser:
```
https://cosmic-timeline-5csl.onrender.com/api/health
```
Should return `{ "status": "healthy" }` ✅

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 1 — Go to Vercel
👉 https://vercel.com/dashboard → Sign in with GitHub

### Step 2 — Import Project
- Click **Add New** → **Project**
- Find your `cosmic-timeline` repo
- Click **Import**

### Step 3 — Configure EXACTLY Like This
| Field              | Value       |
|--------------------|-------------|
| **Root Directory** | `frontend`  ← IMPORTANT! Click Edit |
| Framework Preset   | `Vite`      |
| Build Command      | `npm run build` |
| Output Directory   | `dist`      |

### Step 4 — Add Environment Variable
In the **Environment Variables** section:

| Key            | Value                                                    |
|----------------|----------------------------------------------------------|
| `VITE_API_URL` | `https://cosmic-timeline-5csl.onrender.com/api`         |

> ⚠️ Make sure it ends with `/api` — no trailing slash!

### Step 5 — Click Deploy ✅
- Vercel builds your app (~1-2 minutes)
- You get a URL like: `https://cosmic-timeline-abc123.vercel.app`

### Step 6 — Copy Your Vercel URL
Go back to **Render** → your backend service → **Environment** tab
→ Update `FRONTEND_URL` to your actual Vercel URL
→ Click **Save** (Render will auto-restart)

---

## 🔁 Part 4: Redeploying (After Code Changes)

### Push to GitHub (auto-deploys both)
```bash
git add .
git commit -m "your message"
git push
```
- Render watches your `main` branch → auto-redeploys backend ✅
- Vercel watches your `main` branch → auto-redeploys frontend ✅

### Manual Redeploy on Vercel
Dashboard → Project → Deployments tab → Click ⋯ on latest → **Redeploy**

### Manual Redeploy on Render
Dashboard → Service → **Manual Deploy** button → **Deploy latest commit**

---

## 🌐 Part 5: Environment Variables Reference

### Frontend — Local (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

### Frontend — Production (Vercel Dashboard)
```env
VITE_API_URL=https://cosmic-timeline-5csl.onrender.com/api
```

### Backend — Local (`backend/.env`)
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
NASA_API_KEY=DEMO_KEY
```

### Backend — Production (Render Dashboard)
```env
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
NASA_API_KEY=DEMO_KEY
```

---

## 🐛 Common Issues & Fixes

### ❌ Vercel shows 404
**Cause:** Root Directory not set to `frontend`
**Fix:** Vercel → Settings → General → Root Directory → set `frontend` → Redeploy

### ❌ API calls failing (CORS error)
**Cause:** `FRONTEND_URL` on Render doesn't match your Vercel URL
**Fix:** Render → Environment → update `FRONTEND_URL` → Save

### ❌ VITE_API_URL not working
**Cause:** Missing `/api` at the end of the URL
**Fix:** Set it to `https://cosmic-timeline-5csl.onrender.com/api` (with `/api`)

### ❌ Backend is slow to respond (first request)
**Cause:** Render Free tier spins down after 15 min of inactivity
**Fix:** Normal behavior — first request takes ~30 seconds to wake up. Upgrade to paid plan to avoid.

### ❌ NASA API rate limit error
**Cause:** `DEMO_KEY` only allows 30 requests/hour
**Fix:** Get a free key at https://api.nasa.gov → update `NASA_API_KEY` on Render

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] `NODE_ENV=production` added
- [ ] `NASA_API_KEY` added
- [ ] `FRONTEND_URL` set to your Vercel URL
- [ ] Health check passes at `/api/health`

### Frontend (Vercel)
- [ ] Root Directory set to `frontend`
- [ ] Framework set to `Vite`
- [ ] `VITE_API_URL` set to `https://cosmic-timeline-5csl.onrender.com/api`
- [ ] App loads at your Vercel URL
- [ ] API data loads on the page

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Live Backend | https://cosmic-timeline-5csl.onrender.com |
| Backend Health | https://cosmic-timeline-5csl.onrender.com/api/health |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| NASA API Keys | https://api.nasa.gov |
| GitHub Repo | https://github.com/siyad2951/cosmic-timeline |
