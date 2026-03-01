// Service Worker for Cosmic Timeline
// Enables offline mode by caching all static assets and API responses

const CACHE_NAME = 'cosmic-timeline-v3';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network-first for API, Cache-first for assets
self.addEventListener('fetch', (event) => {
    // Only handle http and https schemes (skip chrome-extension, etc.)
    if (!event.request.url.startsWith('http')) return;

    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // API requests: Network-first with cache fallback
    if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Clone and cache successful responses
                    if (response.ok) {
                        const clonedResponse = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clonedResponse);
                        });
                    }
                    return response;
                })
                .catch(async () => {
                    // Offline: Try to return cached response
                    const cached = await caches.match(event.request);
                    if (cached) return cached;

                    // If no cache and no network, return a generic error response
                    return new Response(JSON.stringify({ error: 'Offline and no cached data available' }), {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }

    // Static assets: Cache-first with network fallback
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((response) => {
                // Cache new assets
                if (response.ok) {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                }
                return response;
            }).catch(() => {
                // Fallback for static assets if both fail
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return null;
            });
        })
    );
});
