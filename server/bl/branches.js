var db = require('../dal');
var Promise = require('promise');
var logger = require('../logger');

module.exports = {
	
	getBranches: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.BranchesFunctions.getBranches()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	addBranch: function(branchName, areaCode) {	
	
		return new Promise(function(resolve, reject) { 
			if ((!branchName) || isNaN(areaCode)) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}
			db.BranchesFunctions.isExists(branchName)
			.done(function(data){				
				if ((data.num_of_branches) && (parseInt(data.num_of_branches))) {
					logger.info('Branch already exists: ' + branchName);
					resolve({'error': 'already_exists'});
					return;
				}
				db.BranchesFunctions.addBranch(branchName, areaCode)
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
	
	updateBranch: function(branchName, areaCode, oldBranchName) {	
	
		return new Promise(function(resolve, reject) { 
			if (!branchName || isNaN(areaCode) || !oldBranchName) {
				logger.info('input is not valid');
				reject({'error': 'input_not_valid'});
				return;
			}
			db.BranchesFunctions.isExists(oldBranchName)
			.done(function(data){				
				if ((data.num_of_branches) && !(parseInt(data.num_of_branches))) {
					logger.info('Branch not exist: ' + oldBranchName);
					resolve({'error': 'not_exist'});
					return;
				}
				db.BranchesFunctions.isExists(branchName)
				.done(function(data){
					if (branchName !== oldBranchName) {
						if ((data.num_of_branches) && (parseInt(data.num_of_branches))) {
							logger.info('Branch already exists: ' + branchName);
							resolve({'error': 'already_exists'});
							return;
						}
					}
					db.BranchesFunctions.updateBranch(branchName, areaCode, oldBranchName)
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