const express = require('express');
const router = express.Router();
const controller = require('../controllers/onThisDayController');

router.get('/', controller.getDiscoveries);
router.get('/today', controller.getDiscoveries);

module.exports = router;
