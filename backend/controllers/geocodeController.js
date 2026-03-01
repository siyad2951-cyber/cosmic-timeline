const axios = require('axios');
const cache = require('../utils/cache');

const GEOCODE_CACHE_TTL = 2592000; // 30 days

exports.geocode = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter q is required' });
        }

        const cacheKey = `geocode_${query.toLowerCase()}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, fromCache: true });
        }

        // nominatim requires User-Agent
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': process.env.NOMINATIM_USER_AGENT || 'CosmicTimeline/1.0'
            }
        });

        const data = {
            query: query,
            results: response.data,
            cacheAgeSeconds: GEOCODE_CACHE_TTL,
            fromCache: false,
            source: 'nominatim'
        };

        cache.set(cacheKey, data, GEOCODE_CACHE_TTL);
        res.json(data);
    } catch (error) {
        next(error);
    }
};
