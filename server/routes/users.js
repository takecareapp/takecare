var express = require('express');
var router = express.Router();
let users = require('../bl/users');
var logger = require('../logger');


router.post('/login', function(req, res){
	logger.info('route: /login');
	var id = req.body.id;
	var password = req.body.password;		
	users.login(id, password).done(function(data){
		req.session.id = (data) ? id : undefined;
		req.session.name = (data) ? id : undefined;
		let is_exists = (data) ? true : false;
		let user_type = (data) ? data[0].user_type : undefined;
		let name = (data) ? data[0].first_name + " " + data[0].last_name : undefined;
		res.json({status: true, is_exists: is_exists, user_type: user_type, name: name, id: id});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/logout', function(req, res){
	logger.info('route: /logout');
	req.session.name = undefined
	res.json({status: true});
});

router.post('/add_client', function(req, res){
	logger.info('route: /add_client');
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}
	var id = req.body.id;	
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var address = req.body.address;
	var phoneNumber = req.body.phoneNumber;
	var email = req.body.email;
	var password = req.body.password;
	users.addClient(id, firstName, lastName, address, phoneNumber, email, password).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

router.post('/get_clients', function(req, res){
	logger.info('route: /get_clients');	
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}
	users.getClients().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/get_deleted_clients', function(req, res){
	logger.info('route: /get_deleted_clients');	
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}
	users.getDeletedClients().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/remove_client', function(req, res){
	logger.info('route: /remove_client');
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}
	var id = req.body.id;	
	
	users.removeClient(id).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

router.post('/update_client', function(req, res){
	logger.info('route: /update_client');
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}
	var id = req.body.id;	
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var address = req.body.address;
	var phoneNumber = req.body.phoneNumber;
	var email = req.body.email;
	
	users.updateClient(id, firstName, lastName, address, phoneNumber, email).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

router.post('/set_is_active_client', function(req, res){
	logger.info('route: /set_is_active_client');
	if (!req.session.name){
		res.json({status: false, error: "Session is empty"});
		return;
	}
	var id = req.body.id;		
	
	users.setIsActiveClient(id).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

module.exports = router;
