// src/utils/browserCache.js
// Centralized browser caching utility using localStorage

const CACHE_VERSION = 'v1';

/**
 * Get cached data if it exists and is still valid
 * @param {string} key - Cache key
 * @returns {object|null} - Cached data or null if not found/expired
 */
export function getCache(key) {
    try {
        const fullKey = `cosmic_${CACHE_VERSION}_${key}`;
        const cached = localStorage.getItem(fullKey);
        if (!cached) return null;

        const { data, expiresAt } = JSON.parse(cached);

        // Check if cache has expired
        if (expiresAt && Date.now() > expiresAt) {
            localStorage.removeItem(fullKey);
            return null;
        }

        return data;
    } catch (e) {
        console.warn('Cache read error:', e);
        return null;
    }
}

/**
 * Set data in cache with optional TTL
 * @param {string} key - Cache key
 * @param {object} data - Data to cache
 * @param {number} ttlMs - Time-to-live in milliseconds (default: until end of day)
 */
export function setCache(key, data, ttlMs = null) {
    try {
        const fullKey = `cosmic_${CACHE_VERSION}_${key}`;

        // Default: expire at end of current day (midnight)
        let expiresAt;
        if (ttlMs) {
            expiresAt = Date.now() + ttlMs;
        } else {
            // Expire at midnight tonight
            const tomorrow = new Date();
            tomorrow.setHours(24, 0, 0, 0);
            expiresAt = tomorrow.getTime();
        }

        localStorage.setItem(fullKey, JSON.stringify({
            data,
            expiresAt,
            cachedAt: Date.now()
        }));
    } catch (e) {
        console.warn('Cache write error:', e);
    }
}

/**
 * Clear all cosmic timeline cache
 */
export function clearAllCache() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('cosmic_')) {
                localStorage.removeItem(key);
            }
        });
    } catch (e) {
        console.warn('Cache clear error:', e);
    }
}

/**
 * Generate cache key based on endpoint and params
 */
export function getCacheKey(endpoint, params = {}) {
    const paramStr = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    return `${endpoint}_${paramStr}`;
}
