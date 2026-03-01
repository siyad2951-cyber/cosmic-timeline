const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for geocoding
const geocodeLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1,
  message: { error: 'Geocoding rate limit: 1 request per second' }
});

module.exports = { apiLimiter, geocodeLimiter };
