import { API_BASE_URL } from './config';
import { getCache, setCache, getCacheKey } from './utils/browserCache';

async function fetchAPI(endpoint, params = {}, options = {}) {
  const { useCache = true, cacheTtlMs = null } = options;
  const cacheKey = getCacheKey(endpoint, params);

  if (useCache) {
    const cached = getCache(cacheKey);
    if (cached) {
      console.log(`[Cache] Hit: ${endpoint}`);
      return cached;
    }
  }

  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Set VITE_API_URL in .env');
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  let url;

  try {
    url = new URL(fullUrl);
  } catch (e) {
    throw new Error(`Invalid API URL: ${fullUrl}`);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.error || 'API Error',
        code: data.code,
        status: response.status,
        fallback: data.fallback,
        fallbackNotice: data.fallbackNotice
      };
    }

    if (useCache) {
      setCache(cacheKey, data, cacheTtlMs);
      console.log(`[Cache] Stored: ${endpoint}`);
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export const api = {
  getSkyEvents: (year, location) =>
    fetchAPI('/sky-events', { year, location }, { cacheTtlMs: TWELVE_HOURS }),
  getDiscoveries: (month, day) =>
    fetchAPI('/discoveries', { month, day }),
  getHistory: (month, day) =>
    fetchAPI('/history', { month, day }),
  getAPOD: () =>
    fetchAPI('/apod'),
  getGeocode: (query) =>
    fetchAPI('/geocode', { q: query }, { cacheTtlMs: TWELVE_HOURS }),
  checkHealth: () =>
    fetchAPI('/health', {}, { useCache: false })
};
