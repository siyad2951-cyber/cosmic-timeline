const express = require('express');
const router = express.Router();
const controller = require('../controllers/geocodeController');
const { geocodeLimiter } = require('../middleware/rateLimit');

// Apply stricter rate limit to geocoding
router.get('/', geocodeLimiter, controller.geocode);

module.exports = router;
