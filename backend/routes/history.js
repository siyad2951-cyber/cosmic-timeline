const express = require('express');
const router = express.Router();
const controller = require('../controllers/onThisDayController');

router.get('/', controller.getHistory);
router.get('/today', controller.getHistory);

module.exports = router;
