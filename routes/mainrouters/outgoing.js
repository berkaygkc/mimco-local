const express = require('express');
const router = express.Router();
const outgoingCalls = require('../subroutes/outgoingCalls');

router.get('/einvoice', outgoingCalls.listeInvoices);
router.get('/einvoice/getlist', outgoingCalls.getList);
router.get('/einvoice/export/:type/:uuid', outgoingCalls.exportInvoice);
router.get('/einvoice/status/:uuid', outgoingCalls.checkEInvoiceStatus);

router.get('/earchive', outgoingCalls.listeArchive);
router.get('/earchive/getlist', outgoingCalls.getListArchive);
router.get('/earchive/export/:type/:uuid', outgoingCalls.exportArchive);


module.exports = router;
