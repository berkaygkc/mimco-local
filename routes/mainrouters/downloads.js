const express = require('express');
const router = express.Router();
const templatesCalls = require('../subroutes/definitionsTemplatesCalls');

router.get('/template/:id', templatesCalls.downloadTemplate );

module.exports = router;
