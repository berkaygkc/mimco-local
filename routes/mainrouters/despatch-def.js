const express = require('express');
const router = express.Router();
const despatchDefCalls = require('../subroutes/despatchDefinitionsCalls');

router.get('/drivers', despatchDefCalls.getDrivers);
router.post('/drivers', despatchDefCalls.newDriver);
router.get('/drivers-list', despatchDefCalls.getDriversList);

router.get('/plates', despatchDefCalls.getPlates);
router.post('/plates', despatchDefCalls.newPlate);
router.get('/plates-list', despatchDefCalls.getPlatesList);

router.get('/carriers', despatchDefCalls.getCarriers);
router.post('/carriers', despatchDefCalls.newCarrier);
router.get('/carriers-list', despatchDefCalls.getCarriersList);


module.exports = router;
