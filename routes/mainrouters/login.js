
const express = require('express');
const router = express.Router();
const loginCalls = require('../subroutes/loginCalls');


router.get('/', loginCalls.getLogin);
router.post('/', loginCalls.postLogin);

module.exports = router;
