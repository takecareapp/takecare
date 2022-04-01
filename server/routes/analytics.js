var express = require('express');
var router = express.Router();
let analytics = require('../bl/analytics');
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
router.post('/get_users_analytics', function(req, res){
	logger.info('route: /get_users_analytics');		
	analytics.getUsersAnalytics().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});		
});

router.post('/get_schedule_pick', function(req, res){
	logger.info('route: /get_schedule_pick');		
	analytics.getSchedulePick().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});		
});

router.post('/get_occupancy_ratio', function(req, res){
	logger.info('route: /get_occupancy_ratio');		
	analytics.getOccupancyRatio().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});		
});

module.exports = router;
