
# Hi, I'm Ashutosh! 👋


Cosmic-Timeline

A full-stack web app visualizing cosmic events using NASA APIs.
## 🚀 Live Demo

👉 (https://your-domain.pages.dev)

## ✨ Features

🌠 Fetches NASA Astronomy Picture of the Day (APOD)

🪐 Displays curated astronomical & sky events

⚡ Fast backend with caching + rate limiting

💾 Smart browser caching - persists across refreshes, updates when data changes

📡 Service Worker - works offline after first visit

🔄 Auto-refresh - updates data every 12 hours without reload

🎨 Responsive UI using TailwindCSS

🚀 Easy deployment to Render, Vercel, Netlify, GitHub Pages & Railway

🔧 Clean file structure & environment-based configuration

## 🧱 Tech Stack

Frontend: Vite • Vanilla JS • TailwindCSS

Backend: Node.js • Express

APIs: NASA APOD API

Deployment: Render (backend), Vercel/Netlify/GitHub Pages (frontend)


## Prerequisites


Node.js 18+

npm 9+

Git
(Optional) NASA API Key — get one free at https://api.nasa.gov

(DEMO_KEY works for limited use)
##  📁 Project Structure
```
cosmic-timeline/
├── backend/                 # Node.js/Express API
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/                # Vite + Vanilla JS + Tailwind
│   ├── src/
│   │   ├── components/      # UI components (APOD, SkyEvents, etc.)
│   │   ├── utils/           # Helpers (browserCache, dateFormat)
│   │   ├── api.js           # API client with caching
│   │   └── main.js          # Entry point + Service Worker registration
│   ├── public/              # Static assets (icons, manifest, sw.js)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── DEPLOYMENT_GUIDE.md
```
## ⚙️ Environment Variables
🔹 Backend (backend/.env)
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
NASA_API_KEY=DEMO_KEY

🔹 Frontend (frontend/.env)
VITE_API_URL=http://localhost:3000/api


For production builds, update these URLs to your deployed services.


## 🧪 Running Locally

1️⃣ Clone Repository
git clone https://github.com/Ashutoshgit47/Cosmic-Timeline.git
cd Cosmic-Timeline

2️⃣ Start Backend
cd backend
npm install
cp .env.example .env     # or manually create .env
npm start


Backend runs at:
➡️ http://localhost:3000

3️⃣ Start Frontend
cd ../frontend
npm install
cp .env.example .env
npm run dev


Frontend runs at:
➡️ http://localhost:5173


## 📡 API Endpoints

| Endpoint           | Description                              |
| ------------------ | ---------------------------------------- |
| `/api/health`      | Health check for backend                 |
| `/api/apod`        | Fetch NASA Astronomy Picture of the Day  |
| `/api/sky-events`  | List curated astronomical events         |
| `/api/discoveries` | Space discoveries on this day            |
| `/api/history`     | Science history events on this day       |

## ☁️ Deployment
Each platform's full instructions are in DEPLOYMENT_GUIDE.md.
Here’s the quick summary:

🔹 Backend → Render

Root directory: backend/

Build: npm install

Start: npm start

Required env vars: FRONTEND_URL, NASA_API_KEY, etc.

🔹 Frontend → Vercel

Root: frontend/

Framework: Vite

Build: npm run build

Output: dist

Env var: VITE_API_URL

🔹 Netlify / GitHub Pages / Railway

All supported — see full guide
## ✅ Post-Deployment Checklist


- Backend /api/health returns "healthy"
- APOD loads correctly
- Sky events appear
- No CORS errors
- FRONTEND_URL updated on backend hosting
- VITE_API_URL updated on frontend hosting
## 🐛 Troubleshooting


❌ CORS errors

Fix by updating backend .env:

FRONTEND_URL=https://your-frontend-url.app

❌ NASA API rate limit

Replace DEMO_KEY with your own NASA API key.

❌ Slow backend on Render

Use UptimeRobot (from deployment guide suggestions).

❌ Build failures

Ensure package-lock.json is committed.
## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## 📜 License

MIT License — use freely.
