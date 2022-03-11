const express = require('express');
const router = express.Router();
const invoicesCalls = require('../subroutes/invoicesCalls');

router.get('/', invoicesCalls.listInvoices);
router.post('/send', invoicesCalls.sendInvoices);
router.get('/preview', invoicesCalls.previewInvoice);

module.exports = router;
