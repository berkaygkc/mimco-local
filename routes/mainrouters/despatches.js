const express = require('express');
const router = express.Router();
const despatchesCalls = require('../subroutes/despatchesCalls');

router.get('/', despatchesCalls.listDespatches);  //irsaliyeleştirildi
router.get('/send/:id', despatchesCalls.sendDespatchRoute);  //irsaliyeleştirildi
router.post('/send/selected', despatchesCalls.sendSelectedInvoicesRouter); //irsaliyeleştirildi

router.get('/mark/sended/:id', despatchesCalls.markSended);  //irsaliyeleştirildi
router.get('/mark/resolved/:id', despatchesCalls.markResolved);  //irsaliyeleştirildi
router.get('/mark/notsended/:id', despatchesCalls.markNotSended);  //irsaliyeleştirildi
router.get('/checkstatus/:id', despatchesCalls.checkDespatchStatus); //irsaliyeleştirildi

router.get('/checklines/:id', despatchesCalls.checkLinesInvoice); //irsaliyeleştirildi

router.get('/statusdetail/:id', despatchesCalls.despatchesDetail); //irsaliyeleştirildi
router.get('/getxml/:id', despatchesCalls.getXML);  //irsaliyeleştirildi
router.get('/getxslt/:id', despatchesCalls.getXSLT);  //irsaliyeleştirildi
router.get('/:id/lines', despatchesCalls.getInvoiceLines); 


router.get('/status', despatchesCalls.listDespatchesStatus);  //irsaliyeleştirildi

router.get('/edit/:id', despatchesCalls.getEditInfo); //irsaliyeleştirildi
router.post('/edit/:id', despatchesCalls.updateEditInfo);

router.get('/refresh/:id', despatchesCalls.refreshDespatch)  //irsaliyeleştirildi


router.get('/drivers', despatchesCalls.getDrivers);
router.get('/plates', despatchesCalls.getPlates);
router.get('/carriers', despatchesCalls.getCarriers);
router.get('/carrier/:id', despatchesCalls.getCarrier);


module.exports = router;
