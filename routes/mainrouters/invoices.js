const express = require('express');
const router = express.Router();
const invoicesCalls = require('../subroutes/invoicesCalls');

router.get('/', invoicesCalls.listInvoices);
router.get('/send/:id', invoicesCalls.sendInvoiceRouter);
router.post('/send/selected', invoicesCalls.sendSelectedInvoicesRouter);

router.get('/mark/sended/:id', invoicesCalls.markSended);
router.get('/mark/resolved/:id', invoicesCalls.markResolved);
router.get('/mark/notsended/:id', invoicesCalls.markNotSended);
router.get('/checkstatus/:id', invoicesCalls.checkInvoiceStatus);

router.get('/statusdetail/:id', invoicesCalls.invoiceDetail);
router.get('/getxml/:id', invoicesCalls.getXML);
router.get('/getxslt/:id', invoicesCalls.getXSLT);


router.get('/status', invoicesCalls.listInvoicesStatus);

router.get('/preview', invoicesCalls.previewInvoice);

module.exports = router;
