const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('layouts/index', {title: 'Ana Sayfa', pagetitle: 'Ana Sayfa' });
});

module.exports = router;
