var express = require('express');
var router = express.Router();
let staffs = require('../bl/staffs');
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
router.post('/get_professions', function(req, res){
	logger.info('route: /get_professions');	
	staffs.getProfessions().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/add_staff', function(req, res){
	logger.info('route: /add_staff');	
	var id = req.body.id;	
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var address = req.body.address;
	var phoneNumber = req.body.phoneNumber;
	var email = req.body.email;
	var password = req.body.password;
	var personalInfo = req.body.personalInfo;
	var branch = req.body.branch;
	var profession = req.body.profession;
	staffs.addStaff(id, firstName, lastName, address, phoneNumber, email, password, personalInfo, branch, profession).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

router.post('/get_staffs', function(req, res){
	logger.info('route: /get_staffs');	
	staffs.getStaffs().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/update_staff', function(req, res){
	logger.info('route: /update_staff');	
	var id = req.body.id;	
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;	
	var phoneNumber = req.body.phoneNumber;	
	var personalInformation = req.body.personalInformation;
	var branchCode = req.body.branchCode;
	var professionCode = req.body.professionCode;
	staffs.updateStaff(id, firstName, lastName, phoneNumber, personalInformation, branchCode, professionCode).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

module.exports = router;
