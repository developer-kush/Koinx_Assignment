const express = require('express');
const cryptoController = require("../controllers/crypto.controller");

const router = express.Router();

router.get('/stats/:coin', cryptoController.getStats);
router.get('/deviation/:coin', cryptoController.getDeviation);

module.exports = router;