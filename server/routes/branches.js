var express = require('express');
var router = express.Router();
let branches = require('../bl/branches');
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
router.post('/get_branches', function(req, res){
	logger.info('route: /get_branches');	
	branches.getBranches().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/add_branch', function(req, res){
	logger.info('route: /add_branch');
	var branchName = req.body.branchName;
	var areaCode = req.body.areaCode;
	branches.addBranch(branchName, areaCode).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/update_branch', function(req, res){
	logger.info('route: /update_branch');
	var branchName = req.body.branchName;
	var areaCode = req.body.areaCode;
	var oldBranchName = req.body.oldBranchName;	
	branches.updateBranch(branchName, areaCode, oldBranchName).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});


module.exports = router;
