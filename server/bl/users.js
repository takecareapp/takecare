var db = require('../dal');
var Promise = require('promise');
const {SHA256} = require('sha2');
var logger = require('../logger');

module.exports = {
	
	login: function(id, password) {	
	
		return new Promise(function(resolve, reject) {			
			hash = SHA256(password).toString("hex");
			db.UserFunctions.getUser(id, hash)
			.done(function(data){
				resolve((data.length) ? data : false);
			},function(e){
				reject(e);
			});			
		});	
		
	},
	
	addClient: function(id, firstName, lastName, address, phoneNumber, email, password) {	
	
		return new Promise(function(resolve, reject) {	

			if (!id || !firstName || !lastName || !password) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.UserFunctions.isExists(id).done(function(data){								
				if ((data.num_of_users) && (parseInt(data.num_of_users))) {
					logger.info('Client id already exists: ' + id);
					resolve({'error': 'already_exists'});
					return;
				}
				
				hash = SHA256(password).toString("hex");
				
				db.UserFunctions.addClient(id, firstName, lastName, address, phoneNumber, email, hash)
					.done(function(data){
						resolve(data);
					},function(e){
						reject(e);
					});	
			},function(e){
				reject(e);
			});		
			
		});			
	},
	
	getClients: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.UserFunctions.getClients()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	getDeletedClients: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.UserFunctions.getDeletedClients()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	removeClient: function(id) {	
	
		return new Promise(function(resolve, reject) {	

			if (!id) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.UserFunctions.isExists(id).done(function(data){								
				if (!(data.num_of_users) || !(parseInt(data.num_of_users))) {
					logger.info('Client id not exist: ' + id);
					resolve({'error': 'not_exists'});
					return;
				}
				
				db.UserFunctions.removeClient(id)
					.done(function(data){						
						db.AppointmentsFunctions.removeAppointmentForDeletedUser(id)
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
	
	updateClient: function(id, firstName, lastName, address, phoneNumber, email) {	
	
		return new Promise(function(resolve, reject) {	

			if (!id || !firstName || !lastName) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.UserFunctions.isExists(id).done(function(data){								
				if (!(data.num_of_users) || !(parseInt(data.num_of_users))) {
					logger.info('Client id not exist: ' + id);
					resolve({'error': 'not_exists'});
					return;
				}	
				
				db.UserFunctions.updateClient(id, firstName, lastName, address, phoneNumber, email)
					.done(function(data){
						resolve(data);
					},function(e){
						reject(e);
					});	
			},function(e){
				reject(e);
			});		
			
		});			
	},
	
	setIsActiveClient: function(id) {	
	
		return new Promise(function(resolve, reject) {	

			if (!id) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.UserFunctions.isExists(id).done(function(data){								
				if (!(data.num_of_users) || !(parseInt(data.num_of_users))) {
					logger.info('Client id not exist: ' + id);
					resolve({'error': 'not_exists'});
					return;
				}	
				
				db.UserFunctions.setIsActiveClient(id)
					.done(function(data){
						resolve(data);
					},function(e){
						reject(e);
					});	
			},function(e){
				reject(e);
			});		
			
		});			
	},
	
	physicalRemoveClient: function(id) {	
	
		return new Promise(function(resolve, reject) {			
			db.UserFunctions.physicalRemoveClient(id)
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	}
	
};