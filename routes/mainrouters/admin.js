const express = require('express');
const router = express.Router();
const sqlRouter = require('../subroutes/adminCalls');

router.get('/sql', sqlRouter.sqlList);
router.post('/sql', sqlRouter.sqlUpdate);

module.exports = router;
