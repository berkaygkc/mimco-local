const express = require('express');
const router = express.Router();
const streamCalls = require('../subroutes/streamCalls');

router.get('/insert/:id', streamCalls.insert);
router.get('/update/:id', streamCalls.update);
router.get('/delete/:id', streamCalls.deleteRecord);

module.exports = router;
