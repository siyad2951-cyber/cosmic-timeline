# Deployment Guide: Backend to Render & Frontend to Vercel

This is a step-by-step guide to deploying your Cosmic Timeline project. We will deploy the backend to Render, then deploy the frontend to Vercel. 

---

## Part 1: Prerequisites

Before we deploy, please make sure you have the following:
1. **GitHub Account**: Since deployment platforms easily link with your GitHub repositories, make sure your code code is pushed to a Github repository!
2. **NASA API Key (Optional but recommended)**: You can use `DEMO_KEY` but getting your own from [NASA Open APIs](https://api.nasa.gov/) will avoid rate limits.

---

## Part 2: Deploy Backend to Render

[Render](https://render.com) is excellent for Node.js backends and has a generous free tier.

### 1. Create a Render Account and Web Service
1. Go to [Render](https://render.com) and sign up/log in with your GitHub account.
2. Once logged in, click **"New +"** in the top right, then select **"Web Service"**.
3. Under "Build and deploy from a Git repository", connect your GitHub account if you haven't already.
4. Select the repository containing your `Cosmic-Timeline` project.

### 2. Configure the Web Service
Set up the service with the following details:
- **Name**: `cosmic-timeline-api` (or a name of your choice)
- **Region**: Choose the region closest to you or your users.
- **Branch**: `main` (or whatever your primary branch is)
- **Root Directory**: `backend` (This is critical, as your backend code is in this sub-folder!)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Select the **Free** tier.

### 3. Add Environment Variables
Scroll down to the "Environment Variables" section. Add the following keys and values:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `NASA_API_KEY` | `your_nasa_api_key` (Or `DEMO_KEY`) |
| `FRONTEND_URL` | `http://localhost:5173` (We will update this later after Vercel deployment) |

### 4. Deploy!
1. Click **"Create Web Service"**.
2. Render will take a few minutes to build and deploy. Wait until it says "Live".
3. **Important**: Near the top of the screen, you will see your new Render URL (e.g., `https://cosmic-timeline-api.onrender.com`). Copy this URL! You need it for the frontend.

---

## Part 3: Deploy Frontend to Vercel

[Vercel](https://vercel.com) provides an incredibly fast and straightforward deployment process for frontend frameworks like Vite.

### 1. Create Vercel Project
1. Go to [Vercel](https://vercel.com) and sign in using your GitHub account.
2. On your dashboard, click **"Add New..."** and select **"Project"**.
3. Find your `Cosmic-Timeline` repository in the list and click **"Import"**.

### 2. Configure Vercel Build Settings
Fill out the configuration as follows:
- **Project Name**: `cosmic-timeline`
- **Framework Preset**: Should automatically detect `Vite`. If not, select it.
- **Root Directory**: `frontend` (Critical! Ensure you specify this folder).

**Build and Output Settings** (Should auto-populate, but verify):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variable
Expand the "Environment Variables" section to connect your shiny new backend:

| Key | Value |
| --- | --- |
| `VITE_API_URL` | `https://your-backend.onrender.com/api` (Replace with your copied Render URL + `/api`) |

### 4. Deploy!
1. Click the **"Deploy"** button.
2. Usually, Vercel deploys under a minute. Once it's done, click **"Continue to Dashboard"**.
3. **Important**: Copy your new frontend URL (e.g., `https://cosmic-timeline.vercel.app`).

---

## Part 4: Final Connection (Update CORS on Backend)

Your frontend is live on Vercel, but currently, your backend on Render is only allowing requests from `localhost`. We need to tell Render to accept requests from your new Vercel site.

1. Go back to your [Render Dashboard](https://dashboard.render.com).
2. Select your `cosmic-timeline-api` web service.
3. Click on the **"Environment"** tab on the left sidebar.
4. Update the `FRONTEND_URL` variable to match your Vercel URL exactly:
   - **Old Value**: `http://localhost:5173`
   - **New Value**: `https://your-frontend-url.vercel.app` (Important: Do not include a trailing slash `/`)
5. Save changes. Render might automatically redeploy, or you may need to click "Manual Deploy" -> "Deploy latest commit".

---

## 🎉 Done!
Your application is fully deployed!
- Try visiting your Vercel URL.
- Test that the events load successfully. If you see CORS errors in the browser console, double-check that your `FRONTEND_URL` in Render matches your frontend URL exactly.
