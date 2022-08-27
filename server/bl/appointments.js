var db = require('../dal');
var Promise = require('promise');
var request = require('request');
var logger = require('../logger');
var nodemailer = require('nodemailer');


module.exports = {
	
	getAppointments: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AppointmentsFunctions.getAppointments()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	getNextFreeAppointments: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AppointmentsFunctions.getNextFreeAppointments()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	removeAppointment: function(staffId, date, hour, id) {	
	
		return new Promise(function(resolve, reject) {	

			if (!staffId || !date || !hour || !id) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.AppointmentsFunctions.isExists(staffId, date, hour, id).done(function(data){								
				if (!(data.result) || !(parseInt(data.result))) {
					logger.info('Something went wrong');
					resolve({'error': 'not_exists'});
					return;
				}
				
				db.AppointmentsFunctions.removeAppointment(staffId, date, hour, id)
					.done(function(data){
						if (hour <= 23) {
							let removeAppointmentData = data;
							db.AppointmentsFunctions.getStandByAppointments(staffId, date)
								.done(function(appointments){
									logger.info(JSON.stringify(appointments));
																
									try {
										 for (let i = 0; i < appointments.length; i++) {								 
											 let phoneNunmber = appointments[i].phone_number;
											 let first_name = appointments[i].first_name;
											 let address = appointments[i].address;
											 let message = `Hello ${first_name}, Appointment is now avalibale for you at takecare app. Enjoy!`;

											 //send mail
											 module.exports.sendMail(message, address);

											 //send sms
											 request.post('https://textbelt.com/text', {
											  form: {
												phone: phoneNunmber,
												message: message,
												key: 'textbelt',
											  },
											}, function(err, httpResponse, body) {
											  if (err) {
												logger.error('Error:', err);
											  } else {
												  logger.info(JSON.parse(body));
											  }
											  if (i == appointments.length -1) {
												  logger.info('finish send messages');												  
											  }					  
											});
										}
									}
									catch(error) {
									  logger.error(error);
									  logger.info('not finish send messages - Exception');
									}
									resolve(removeAppointmentData);
								},function(e){
									logger.error(e);
									resolve(removeAppointmentData);
								});						
						}
						resolve(data);
					},function(e){
						reject(e);
					});	
			},function(e){
				reject(e);
			});		
			
		});			
	},
	
	getPreviousAppointments: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AppointmentsFunctions.getPreviousAppointments()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	getPreviousAppointmentsById: function(id) {	
	
		return new Promise(function(resolve, reject) {			
			db.AppointmentsFunctions.getPreviousAppointmentsById(id)
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	getNextAppointmentsById: function(id) {	
	
		return new Promise(function(resolve, reject) {			
			db.AppointmentsFunctions.getNextAppointmentsById(id)
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	scheduleAppointment: function(staffId, date, hour, clientId) {	
	
		return new Promise(function(resolve, reject) {	

			if (!staffId || !date || !hour || !clientId) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.AppointmentsFunctions.isClientAlreadyScheduledAppointment(date, clientId, hour, staffId).done(function(data){		
		
				if (data.result && parseInt(data.result)) {
					logger.info('scheduleAppointment - already_exists')
					resolve({'error': 'already_exists'});
					return;
				}
				
				db.AppointmentsFunctions.isStandByexceeded(clientId, hour).done(function(data){	

					if (data.result && parseInt(data.result)) {
						logger.info('scheduleAppointment - stand_by_exceeded')
						resolve({'error': 'stand_by_exceeded'});
						return;
					}
				
					db.AppointmentsFunctions.isAppointmentAvailable(staffId, date, hour).done(function(data){	

						if (data.result && !parseInt(data.result)) {
							logger.info('scheduleAppointment - something_went_wrong')
							resolve({'error': 'something_went_wrong'});
							return;
						}
					
						db.AppointmentsFunctions.scheduleAppointment(staffId, date, hour, clientId).done(function(data){							
							resolve(data);
						},function(e){
							reject(e);
						});	
					},function(e){
						reject(e);
					});	
				},function(e){
					reject(e);
				});		
				
			},function(e){
				reject(e);
			});		
			
		});			
	},
	
	getMessagesById: function(id) {	
	
		return new Promise(function(resolve, reject) {			
			db.AppointmentsFunctions.getMessagesById(id)
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	rescheduleAppointment: function(staffId, date, hour, clientId) {	
	
		return new Promise(function(resolve, reject) {	

			if (!staffId || !date || !hour || !clientId) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.AppointmentsFunctions.isAppointmentAvailable(staffId, date, hour).done(function(data){	

				if (data.result && !parseInt(data.result)) {
					logger.info('scheduleAppointment - something_went_wrong')
					resolve({'error': 'something_went_wrong'});
					return;
				}
			
				db.AppointmentsFunctions.scheduleAppointment(staffId, date, hour, clientId)
					.done(function(data){							
							db.AppointmentsFunctions.removeAppointmentAfterReschedule(staffId, date, clientId, hour)
								.done(function(data){
									resolve(data);
								},function(e){
									reject(e);
								});	
				},function(e){
					reject(e);
				});
			},function(e){
				reject(e);
			});	
			
		});			
	},

	sendMail: function(message, address) {

		try {
			let transport = nodemailer.createTransport({
				host: 'smtp-mail.outlook.com',                  // hostname
				service: 'outlook',                             // service name
				secureConnection: false,
				tls: {
					ciphers: 'SSLv3'                            // tls version
				},
				port: 587,                                      // port
				auth: {
					user: "takecareapp4@outlook.com",
					pass: "!!A12345678a12345678"
				}
			});

			let mailOptions = {
				from: 'takecareapp4@outlook.com',
				to: address,
				subject: 'Notification from TakeCareApp',
				text: message
			};

			transport.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});

		} catch(error) {
			logger.error(error);
			logger.info('Failed to sendMail');
		}

	}
	
};