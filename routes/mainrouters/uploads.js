const express = require('express');
const router = express.Router();
const templatesCalls = require('../subroutes/definitionsTemplatesCalls');

router.post('/template/:type', templatesCalls.uploadTemplate );

module.exports = router;
