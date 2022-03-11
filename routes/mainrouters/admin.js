const express = require('express');
const router = express.Router();
const sqlRouter = require('../subroutes/adminCalls');
const hasToken = require('../../src/middlewares/mimsoft/hasToken');
const mimsoft = require('../../src/entegrator/mimsoft/index');

router.get('/sql', sqlRouter.sqlList);
router.post('/sql', sqlRouter.sqlUpdate);
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
router.get('/testxmls/:id', sqlRouter.testxmls);

module.exports = router;
