var express = require('express');
var router = express.Router();
var main = require('../lib/main');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', body: main.temp + main.tomp() });
});

module.exports = router;
