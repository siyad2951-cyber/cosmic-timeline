let rawUrl = import.meta.env.VITE_API_URL || '';

if (rawUrl.startsWith('VITE_API_URL=')) {
    rawUrl = rawUrl.replace('VITE_API_URL=', '');
}

export const API_BASE_URL = rawUrl;
export const API_KEY = import.meta.env.VITE_NASA_API_KEY;