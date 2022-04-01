var express = require('express');
var router = express.Router();
let areas = require('../bl/area');
var logger = require('../logger');
/*
router.use(function (req, res, next) {	
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}	
	next();
});
*/
router.post('/get_areas', function(req, res){
	logger.info('route: /get_areas');		
	areas.getAreas().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});		
});

module.exports = router;
