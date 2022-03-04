const express = require('express');
const router = express.Router();
const streamCalls = require('../subroutes/streamCalls');

router.get('/insert/:id', streamCalls.insert);

module.exports = router;
