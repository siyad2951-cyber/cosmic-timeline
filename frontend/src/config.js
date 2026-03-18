// Production backend URL
const PRODUCTION_API_URL = 'https://cosmic-timeline-5csl.onrender.com/api';

// Check if we are in production by looking at the current domain,
// or use the Vite DEV flag. This ensures we never use a broken env var from Vercel.
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// If testing locally, go to localhost:3000. If deployed, always go to actual Render URL.
export const API_BASE_URL = isLocalhost ? 'http://localhost:3000/api' : PRODUCTION_API_URL;
export const API_KEY = import.meta.env.VITE_NASA_API_KEY;