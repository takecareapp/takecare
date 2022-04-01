var express = require('express');
var router = express.Router();
let appointments = require('../bl/appointments');
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
router.post('/get_appointments', function(req, res){
	logger.info('route: /get_appointments');	
	appointments.getAppointments().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/get_next_free_appointments', function(req, res){
	logger.info('route: /get_next_free_appointments');	
	appointments.getNextFreeAppointments().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/remove_appointment', function(req, res){
	logger.info('route: /remove_appointment');
	var staffId = req.body.staffId;
	var date = req.body.date;
	var hour = req.body.hour;
	var id = req.body.id;
	appointments.removeAppointment(staffId, date, hour, id).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

router.post('/schedule_appointment', function(req, res){
	logger.info('route: /schedule_appointment');
	var staffId = req.body.staffId;
	var date = req.body.date;
	var hour = req.body.hour;
	var clientId = req.body.clientId;
	appointments.scheduleAppointment(staffId, date, hour, clientId).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});


router.post('/get_previous_appointments', function(req, res){
	logger.info('route: /get_previous_appointments');
	appointments.getPreviousAppointments().done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/get_previous_appointments_by_id', function(req, res){
	logger.info('route: /get_previous_appointments_by_id');
	var id = req.body.id;
	appointments.getPreviousAppointmentsById(id).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/get_next_appointments_by_id', function(req, res){
	logger.info('route: /get_next_appointments_by_id');	
	var id = req.body.id;
	appointments.getNextAppointmentsById(id).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/get_messages_by_id', function(req, res){
	logger.info('route: /get_messages_by_id');	
	var id = req.body.id;
	appointments.getMessagesById(id).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});	
});

router.post('/reschedule_appointment', function(req, res){
	logger.info('route: /reschedule_appointment');
	var staffId = req.body.staffId;
	var date = req.body.date;
	var hour = req.body.hour;
	var clientId = req.body.clientId;
	appointments.rescheduleAppointment(staffId, date, hour, clientId).done(function(data){		
		res.json({status: true, data: data});
	},function(e){
		res.json({status: false, error: e});
	});			
});

module.exports = router;
