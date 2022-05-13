const express = require('express');
const router = express.Router();
const sqlRouter = require('../subroutes/adminCalls');

router.get('/sql', sqlRouter.sqlList);
router.post('/sql', sqlRouter.sqlUpdate);


router.get('/sql/despatches', sqlRouter.sqlListDespatches);
router.post('/sql/despatches', sqlRouter.sqlUpdateDespatches);

module.exports = router;
