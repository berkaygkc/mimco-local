const express = require('express');
const router = express.Router();
const incomingCalls = require('../subroutes/incomingCalls');

router.get('/einvoice', incomingCalls.listeInvoices);
router.get('/einvoice/getlist', incomingCalls.getList);
router.get('/einvoice/export/:type/:uuid', incomingCalls.exportInvoice);
router.get('/einvoice/status/:uuid', incomingCalls.checkEInvoiceStatus);
router.post('/einvoice/reply/:uuid', incomingCalls.replyInvoice);
router.post('/einvoice/uuids_status', incomingCalls.getUUIDsDetails);
router.post('/einvoice/uuids_lines_status', incomingCalls.getUUIDsLineDetails);

router.get('/edespatch', incomingCalls.listeDespatch);
router.get('/edespatch/getlist', incomingCalls.getListDespatch);
router.get('/edespatch/export/:type/:uuid', incomingCalls.exportDespatch);
router.get('/edespatch/status/:uuid', incomingCalls.checkEDespatchStatus);
router.post('/edespatch/reply/:uuid', incomingCalls.replyDespatch);


module.exports = router;
