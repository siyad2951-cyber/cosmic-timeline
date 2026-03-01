const express = require('express');
const router = express.Router();
const apodController = require('../controllers/apodController');

router.get('/', apodController.getAPOD);

module.exports = router;
