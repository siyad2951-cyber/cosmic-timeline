const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 3600, // Default 1 hour
    checkperiod: 600,
    useClones: false
});

module.exports = cache;
