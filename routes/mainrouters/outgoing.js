const express = require('express');
const { RequestError } = require('mssql');
const router = express.Router();
const outgoingCalls = require('../subroutes/outgoingCalls');

router.get('/einvoice', outgoingCalls.listeInvoices);
router.get('/einvoice/getlist', outgoingCalls.getList);
router.get('/einvoice/export/:type/:uuid', outgoingCalls.exportInvoice);
router.get('/einvoice/status/:uuid', outgoingCalls.checkEInvoiceStatus);

router.get('/earchive', outgoingCalls.listeArchive);
router.get('/earchive/getlist', outgoingCalls.getListArchive);
router.get('/earchive/export/:type/:uuid', outgoingCalls.exportArchive);
router.get('/earchive/status/:uuid', outgoingCalls.checkEArchiveStatus);
router.get('/earchive/cancel/:uuid', outgoingCalls.cancelInvoice);

router.get('/edespatch', outgoingCalls.listeDespatch);
router.get('/edespatch/getlist', outgoingCalls.getListDespatch);
router.get('/edespatch/export/:type/:uuid', outgoingCalls.exportDespatch);
router.get('/edespatch/status/:uuid', outgoingCalls.checkEDespatchStatus);

router.post('/mark', outgoingCalls.markInvoice);
router.post('/mark/archive', outgoingCalls.markArchive);
router.post('/mark/despatch', outgoingCalls.markDespatch);


module.exports = router;
