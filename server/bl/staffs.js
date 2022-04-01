var db = require('../dal');
var Promise = require('promise');
const {SHA256} = require('sha2');
var logger = require('../logger');

module.exports = {
	
	getProfessions: function(id, password) {	
	
		return new Promise(function(resolve, reject) {			
			db.StaffsFunctions.getProfessions()
			.done(function(data){
				resolve(data);
			},function(e){
				reject(e);
			});			
		});	
		
	},
	
	addStaff: function(id, firstName, lastName, address, phoneNumber, email, password, personalInfo, branch, profession) {	
	
		return new Promise(function(resolve, reject) {	

			if (!id || !firstName || !lastName || !password || !profession || !branch) {
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
				
				db.StaffsFunctions.addGeneralStaff(id, firstName, lastName, address, phoneNumber, email, hash)
					.done(function(data){						
						db.StaffsFunctions.addStaff(id, personalInfo, branch, profession)
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
	
	getStaffs: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.StaffsFunctions.getStaffs()
			.done(function(data){
				resolve(data);
			},function(e){
				reject(e);
			});			
		});	
		
	},
	
	updateStaff: function(id, firstName, lastName, phoneNumber, personalInformation, branchCode, professionCode) {	
	
		return new Promise(function(resolve, reject) {	

			if (!id || !firstName || !lastName || !branchCode || !professionCode) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}

			db.UserFunctions.isExists(id).done(function(data){								
				if (!(data.num_of_users) || !(parseInt(data.num_of_users))) {
					logger.info('Client id already exists: ' + id);
					resolve({'error': 'already_exists'});
					return;
				}
				
				db.StaffsFunctions.updateGeneralStaff(id, firstName, lastName, phoneNumber)
					.done(function(data){						
						db.StaffsFunctions.updateStaff(id, personalInformation, branchCode, professionCode)
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
	}
	
};