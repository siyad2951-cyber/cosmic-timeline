// Production fallback — used if VITE_API_URL is not set in Vercel dashboard
const PRODUCTION_API_URL = 'https://cosmic-timeline-5csl.onrender.com/api';

let rawUrl = import.meta.env.VITE_API_URL || '';

if (rawUrl.startsWith('VITE_API_URL=')) {
    rawUrl = rawUrl.replace('VITE_API_URL=', '');
}

export const API_BASE_URL = rawUrl || PRODUCTION_API_URL;
export const API_KEY = import.meta.env.VITE_NASA_API_KEY;