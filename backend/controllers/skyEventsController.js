const axios = require('axios');
const cheerio = require('cheerio');
const cache = require('../utils/cache');
const skyEvents2025 = require('../data/skyEvents2025');
const skyEvents2026 = require('../data/skyEvents2026');

const SKY_EVENTS_CACHE_KEY_PREFIX = 'sky_events_';
const SKY_EVENTS_TTL = 604800; // 7 days

const MONTH_MAP_SHORT = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

const MONTH_MAP_FULL = {
    'january': '01', 'february': '02', 'march': '03', 'april': '04',
    'may': '05', 'june': '06', 'july': '07', 'august': '08',
    'september': '09', 'october': '10', 'november': '11', 'december': '12'
};

async function scrapeMeteorShowers(year) {
    const url = `https://www.timeanddate.com/astronomy/meteor-shower/list.html?year=${year}`;
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const events = [];

    let targetTable = null;
    $('table').each((i, table) => {
        if ($(table).text().includes('Peak') && $(table).text().includes('Shower')) {
            targetTable = $(table);
            return false;
        }
    });

    if (targetTable) {
        targetTable.find('tbody tr').each((i, row) => {
            const cols = $(row).find('td, th');
            if (cols.length > 0) {
                const nameLink = $(cols[0]).find('a');
                const name = nameLink.text().trim();
                const link = nameLink.attr('href');
                const period = $(cols[1]).text().trim();
                const peakDate = $(cols[2]).text().trim();

                if (name && peakDate) {
                    events.push({
                        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                        name,
                        type: 'meteor_shower',
                        period,
                        peakDate,
                        visibilityRegions: ['Global'],
                        visibilityRating: 3,
                        description: `Meteor shower active from ${period}, peaking around ${peakDate}.`,
                        source: 'timeanddate.com',
                        sourceUrl: link ? `https://www.timeanddate.com${link}` : null
                    });
                }
            }
        });
    }

    return events;
}

async function scrapeEclipses(year) {
    const url = `https://www.timeanddate.com/eclipse/list.html?year=${year}`;
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const events = [];
    const addedIds = new Set();

    $('a[href*="/eclipse/"]').each((i, link) => {
        const href = $(link).attr('href');
        const text = $(link).text().trim();

        if (href && href.includes(`/${year}`) && (href.includes('/solar/') || href.includes('/lunar/'))) {
            const isSolar = href.includes('/solar/');
            let eventName = `${isSolar ? 'Solar' : 'Lunar'} Eclipse`;

            if (text.toLowerCase().includes('total')) {
                eventName = isSolar ? 'Total Solar Eclipse' : 'Total Lunar Eclipse';
            } else if (text.toLowerCase().includes('annular')) {
                eventName = 'Annular Solar Eclipse';
            } else if (text.toLowerCase().includes('partial')) {
                eventName = isSolar ? 'Partial Solar Eclipse' : 'Partial Lunar Eclipse';
            } else if (text.toLowerCase().includes('penumbral')) {
                eventName = 'Penumbral Lunar Eclipse';
            }

            const dateMatch = href.match(/(\d{4})-(\w+)-(\d+)/);
            if (dateMatch) {
                const eYear = dateMatch[1];
                const monthName = dateMatch[2];
                const day = dateMatch[3].padStart(2, '0');
                const month = MONTH_MAP_FULL[monthName.toLowerCase()];
                const eventId = `${eventName.toLowerCase().replace(/\s+/g, '-')}-${eYear}`;

                if (month && !addedIds.has(eventId)) {
                    addedIds.add(eventId);
                    const monthShort = monthName.charAt(0).toUpperCase() + monthName.slice(1, 3);
                    events.push({
                        id: eventId,
                        name: eventName,
                        type: 'Eclipse',
                        period: `${monthShort} ${parseInt(day)}, ${eYear}`,
                        peakDate: `${monthShort} ${parseInt(day)}, ${eYear}`,
                        dateUTC: `${eYear}-${month}-${day}T00:00:00Z`,
                        description: `${eventName} visible worldwide.`,
                        visibilityRegions: ['Global'],
                        visibilityRating: 5,
                        source: 'timeanddate.com',
                        sourceUrl: `https://www.timeanddate.com${href}`
                    });
                }
            }
        }
    });

    return events;
}

function normalizeDates(events, year) {
    return events.map(e => {
        if (!e.dateUTC && e.peakDate) {
            const dateParts = e.peakDate.split(' ');
            if (dateParts.length >= 2) {
                const monthStr = dateParts[0];
                const dayStr = dateParts[1].replace(/[^0-9]/g, '');
                const m = MONTH_MAP_SHORT[monthStr.substring(0, 3)];
                if (m && dayStr) {
                    e.dateUTC = `${year}-${m}-${dayStr.padStart(2, '0')}T00:00:00Z`;
                }
            }
        }
        return e;
    });
}

function filterByLocation(events, location) {
    if (!location) return events;
    const normalizedLocation = location.toLowerCase().trim();
    return events.filter(event => {
        if (!event.visibilityRegions) return true;
        return event.visibilityRegions.some(region =>
            region.toLowerCase().includes(normalizedLocation) ||
            normalizedLocation.includes(region.toLowerCase()) ||
            region.toLowerCase() === 'global'
        );
    });
}

exports.getSkyEvents = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const location = req.query.location;
        const cacheKey = `${SKY_EVENTS_CACHE_KEY_PREFIX}${year}${location ? '_' + location.toLowerCase() : ''}`;

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json({ ...cachedData, fromCache: true });
        }

        let events = [];

        // For known years, use static data with detailed descriptions
        // For unknown years, scrape meteor showers
        if (year === 2025) {
            events = [...skyEvents2025];
        } else if (year === 2026) {
            events = [...skyEvents2026];
        } else {
            // Scrape meteor showers for unknown years
            try {
                events = await scrapeMeteorShowers(year);
            } catch (err) {
                // No fallback for unknown years
            }
        }

        // Scrape eclipses
        try {
            const eclipses = await scrapeEclipses(year);
            events = events.concat(eclipses);
        } catch (err) {
            // Eclipse scraping failed silently
        }

        events = filterByLocation(events, location);
        events = normalizeDates(events, year);

        events.sort((a, b) => {
            const dateA = new Date(a.dateUTC || a.date || a.peakDate || 0);
            const dateB = new Date(b.dateUTC || b.date || b.peakDate || 0);
            return dateA - dateB;
        });

        const data = {
            year,
            events,
            total: events.length,
            cacheAgeSeconds: SKY_EVENTS_TTL,
            fromCache: false
        };

        cache.set(cacheKey, data, SKY_EVENTS_TTL);
        res.json(data);

    } catch (error) {
        const fallbackData = {
            year: new Date().getFullYear(),
            events: skyEvents2026,
            total: skyEvents2026.length,
            fromCache: false,
            fallbackNotice: 'Using cached event data'
        };
        res.json(fallbackData);
    }
};
