# Ultimate Step-by-Step Deployment Guide (Render + Vercel)

This guide will walk you through precisely how to deploy the **Cosmic Timeline** application. 
The architecture consists of two parts:
1. **Backend** (Node.js/Express) -> Hosted on **Render**
2. **Frontend** (Vite/Vanilla JS) -> Hosted on **Vercel**

---

## 🛑 Step 0: Prerequisites 
Before you start, make sure:
1. Your code is pushed to a **GitHub repository**.
2. You have created free accounts on [Render.com](https://render.com) and [Vercel.com](https://vercel.com) using your GitHub account.

---

## 🚀 Step 1: Deploy Backend to Render

Your backend serves all data and handles APIs. We must deploy it **first** so the frontend knows who to talk to.

1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub account and select your `Cosmic-Timeline` repository.
3. Configure your Web Service exactly like this:
   - **Name**: `cosmic-timeline-backend` (or similar)
   - **Root Directory**: `backend` *(Crucial! Don't leave this blank)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **Environment Variables** and add:
   - Key: `NODE_ENV` | Value: `production`
   - Key: `NASA_API_KEY` | Value: `DEMO_KEY` (or use your real API key)
5. Click **Create Web Service**.
6. Wait 2-3 minutes for the build to finish. Once it says "Live", copy the generated URL at the top left (e.g., `https://cosmic-timeline-backend.onrender.com`).

---

## 🎨 Step 2: Deploy Frontend to Vercel

Now that your backend is alive, we deploy the frontend UI and connect it to your Render backend.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Import your `Cosmic-Timeline` GitHub repository.
3. In the project config screen, ensure the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Click Edit and select the "frontend" folder)*
4. Open the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://cosmic-timeline-backend.onrender.com/api` *(Paste your Render backend URL here, and make sure it ends with `/api` without a trailing slash!)*
5. Click **Deploy**.
6. Vercel will build your frontend. Once complete, click **Continue to Dashboard** and visit your beautiful new URL!

---

## 🐛 Bug Fixes Completed!
As part of reviewing the code, the following major bugs were identified and fixed beforehand to ensure your deployment would run smoothly:
- **NASA API Timeout Issue**: Reduced the `axios` timeout to gracefully use the offline fallback instead of crashing serverless platforms (which causes fifty-two type proxy timeout errors).
- **Date Normalization Mutation**: Patched an elusive bug in `skyEventsController.js` where nested date objects were globally mutated in caching loops, which previously contaminated future requests.

### ✨ You are now completely optimized and ready to deploy! Enjoy your production-ready Cosmic app!
