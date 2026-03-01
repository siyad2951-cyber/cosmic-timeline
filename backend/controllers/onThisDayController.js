const axios = require('axios');
const cache = require('../utils/cache');

const HISTORY_CACHE_TTL = 86400; // 24 hours

const SPACE_KEYWORDS = ['space', 'universe', 'planet', 'nasa', 'astronomy', 'galaxy', 'satellite', 'telescope', 'moon', 'mars', 'orbit', 'launch', 'comet', 'asteroid', 'eclipse'];
const SCIENCE_KEYWORDS = ['science', 'technology', 'invention', 'physics', 'chemistry', 'biology', 'computer', 'internet', 'radio', 'nobel', 'mathematics', 'scientist', 'physicist'];

async function fetchOnThisDay(month, day) {
    const cacheKey = `wiki_onthisday_${month}_${day}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const pMonth = month.toString().padStart(2, '0');
    const pDay = day.toString().padStart(2, '0');
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${pMonth}/${pDay}`;

    const response = await axios.get(url, {
        headers: { 'User-Agent': 'CosmicTimeline/1.1' },
        timeout: 15000
    });

    const data = response.data;
    cache.set(cacheKey, data, HISTORY_CACHE_TTL);
    return data;
}

function filterByKeywords(items, keywords) {
    return items.filter(item => {
        const text = item.text.toLowerCase();
        return keywords.some(k => text.includes(k));
    });
}

exports.getDiscoveries = async (req, res, next) => {
    try {
        const today = new Date();
        const month = req.query.month || (today.getMonth() + 1);
        const day = req.query.day || today.getDate();

        const data = await fetchOnThisDay(month, day);

        const events = filterByKeywords(
            (data.events || []).concat(data.selected || []),
            SPACE_KEYWORDS
        ).map(event => ({
            ...event,
            category: 'Space Discovery',
            source: 'wikipedia'
        }));

        res.json({
            date: `${month}/${day}`,
            discoveries: events,
            fromCache: false
        });
    } catch (error) {
        next(error);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const today = new Date();
        const month = req.query.month || (today.getMonth() + 1);
        const day = req.query.day || today.getDate();

        const data = await fetchOnThisDay(month, day);

        const events = filterByKeywords(data.events || [], SCIENCE_KEYWORDS);
        const births = filterByKeywords(data.births || [], SCIENCE_KEYWORDS).slice(0, 10);

        res.json({
            date: `${month}/${day}`,
            events,
            births,
            fromCache: false
        });
    } catch (error) {
        next(error);
    }
};
