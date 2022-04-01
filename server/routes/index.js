var express = require('express');
var router = express.Router();
var logger = require('../logger');

/* GET home page. */
router.get('/', function (req, res, next) {
	logger.info('route: /');
    res.render('index', {title: 'Express'});
});

module.exports = router;
