const express = require('express');
const router = express.Router();
const clientCalls = require('../subroutes/clientCalls');

router.get('/info', clientCalls.userInfo);
router.post('/info', clientCalls.userInfoUpdate);

router.get('/entegrator', clientCalls.entegratorInfo);
router.post('/entegrator', clientCalls.entegratorInfoUpdate);

module.exports = router;
