const axios = require('axios');
const cache = require('../utils/cache');

const APOD_CACHE_KEY_PREFIX = 'apod_';
const APOD_TTL = 43200; // 12 hours
const FALLBACK_TTL = 3600; // 1 hour

const FALLBACK_DATA = {
    title: "The Einstein Cross Gravitational Lens",
    date: "2026-01-04",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Einstein_cross.jpg/800px-Einstein_cross.jpg",
    hdurl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Einstein_cross.jpg",
    media_type: "image",
    explanation: "Most galaxies have a single nucleus -- does this galaxy have four? The strange answer leads astronomers to conclude that the nucleus of the surrounding galaxy is not even visible in this image. The central cloverleaf is rather light emitted from a background quasar. The gravitational field of the visible foreground galaxy breaks light from this distant quasar into four distinct images. The quasar must be properly aligned behind the center of a massive galaxy for a+mirage like this to be evident. The general effect is known as gravitational lensing, and this specific case is known as the Einstein Cross. Stranger still, the relative brightness of the images in the Einstein Cross varies, suggesting the lensing galaxy may contain bright stars that provide an additional lens effect, a phenomenon known as microlensing. The featured image was taken with the 3.5-meter WIYN Telescope at the Kitt Peak National Observatory in Arizona, USA.",
    copyright: "NSF, NOIRLab, AURA, WIYN; Processing: J. Rhoads (Arizona State U.) et al.",
    source: "fallback_manual",
    fromCache: false
};

exports.getAPOD = async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `${APOD_CACHE_KEY_PREFIX}${today}`;

        const cachedData = cache.get(cacheKey);
        // Only use cache if it has real data, not fallback
        if (cachedData && cachedData.source !== 'fallback') {
            console.log(`[APOD] Serving from cache: ${cacheKey}`);
            return res.json({ ...cachedData, fromCache: true });
        } else if (cachedData) {
            console.log(`[APOD] Cache has fallback data. Re-attempting fetch...`);
        }

        const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
        console.log(`[APOD] Fetching from NASA with key ending in ...${apiKey.slice(-4)}`);

        try {
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
                timeout: 25000
            });
            console.log(`[APOD] NASA API Success: ${response.status}`);

            const data = {
                ...response.data,
                source: 'nasa_apod',
                cacheAgeSeconds: APOD_TTL,
                fromCache: false
            };

            cache.set(cacheKey, data, APOD_TTL);
            res.json(data);
        } catch (apiError) {
            console.error(`[APOD] NASA API Error: ${apiError.message}`, apiError.response?.data);
            const fallbackData = { ...FALLBACK_DATA, date: today };
            cache.set(cacheKey, fallbackData, FALLBACK_TTL);
            return res.json(fallbackData);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = error.response?.status || 500;
        }
        next(error);
    }
};
