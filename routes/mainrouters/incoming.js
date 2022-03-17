const express = require('express');
const router = express.Router();
const incomingCalls = require('../subroutes/incomingCalls');

router.get('/einvoice', incomingCalls.listeInvoices);
router.get('/einvoice/getlist', incomingCalls.getList);
router.get('/einvoice/export/:type/:uuid', incomingCalls.exportInvoice);


module.exports = router;
