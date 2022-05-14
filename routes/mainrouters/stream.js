const express = require('express');
const router = express.Router();
const streamCalls = require('../subroutes/streamCalls');

router.get('/insert/despatch/:id', streamCalls.insertDespatch);
router.get('/update/despatch/:id', streamCalls.updateDespatch);
router.get('/delete/despatch/:id', streamCalls.deleteDespatch);

router.get('/insert/:id', streamCalls.insert);
router.get('/update/:id', streamCalls.update);
router.get('/delete/:id', streamCalls.deleteRecord);


module.exports = router;
