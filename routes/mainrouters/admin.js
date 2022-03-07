const express = require('express');
const router = express.Router();
const sqlRouter = require('../subroutes/admin/sqlList');
const hasToken = require('../../src/middlewares/mimsoft/hasToken');
const xmlBuidler = ('')

router.get('/client/sql', sqlRouter.sqlList);
router.post('/client/sql', sqlRouter.sqlUpdate);
router.get('/client/info', sqlRouter.userInfo);
router.post('/client/info', sqlRouter.userInfoUpdate);
router.get('/test', hasToken, (req, res) => {
    return res.send(req.ent_token);
})

router.get('/testxml/:id', sqlRouter.testxml);

module.exports = router;
