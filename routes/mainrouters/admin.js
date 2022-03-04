const express = require('express');
const router = express.Router();
const sqlRouter = require('../subroutes/admin/sqlList');

router.get('/client/sql', sqlRouter.sqlList);
router.post('/client/sql', sqlRouter.sqlUpdate);

module.exports = router;
