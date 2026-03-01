const express = require('express');
const router = express.Router();
const skyEventsController = require('../controllers/skyEventsController');

router.get('/', skyEventsController.getSkyEvents);

module.exports = router;
