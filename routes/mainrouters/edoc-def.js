const express = require('express');
const router = express.Router();
const seriesCalls = require('../subroutes/definitionsSeriesCalls');
const templatesCalls = require('../subroutes/definitionsTemplatesCalls');

router.get('/series', seriesCalls.getSeries);
router.get('/series/:type', seriesCalls.getSeriesFilterType);

router.get('/series/:type/default/:serie', seriesCalls.beDefault);
router.get('/series/:type/activate/:serie', seriesCalls.activate);
router.get('/series/:type/deactivate/:serie', seriesCalls.deactivate);
router.get('/series/:type/add/:serie', seriesCalls.addSerie);


router.get('/templates/xml', templatesCalls.getXML);
router.get('/templates/detail/:id', templatesCalls.getXSLT);
router.get('/templates/delete/:id', templatesCalls.deleteTemplate);

router.get('/templates', templatesCalls.getTemplates);
router.get('/templates/:type', templatesCalls.getTemplatesFilterType);

router.get('/templates/:type/default/:id', templatesCalls.beDefault);
router.get('/templates/:type/activate/:id', templatesCalls.activate);
router.get('/templates/:type/deactivate/:id', templatesCalls.deactivate);


module.exports = router;
