const express = require('express');
const router = express.Router();
const sqlRouter = require('../subroutes/admin/sqlList');
const hasToken = require('../../src/middlewares/mimsoft/hasToken');
const mimsoft = require('../../src/entegrator/mimsoft/index');

router.get('/client/sql', sqlRouter.sqlList);
router.post('/client/sql', sqlRouter.sqlUpdate);
router.get('/client/info', sqlRouter.userInfo);
router.post('/client/info', sqlRouter.userInfoUpdate);
router.get('/test', hasToken, (req, res) => {
    return res.send(req.ent_token);
})
router.get('/testVkn/:vkn', hasToken, (req, res) => {
    mimsoft
    .getAliases(req.params.vkn, req.ent_token)
    .then(result => {
        console.log('vkn result : ', result);
        return res.send(result);
    })
    .catch(err => {
        console.log('vkn err ', err);
        return res.send(err);
    });
    
    return res.send(500);
})

router.get('/testxml/:id', sqlRouter.testxml);
router.get('/testxmls/:id', sqlRouter.testxmls);

module.exports = router;
