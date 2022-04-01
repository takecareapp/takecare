var db = require('../dal');
var Promise = require('promise');
var logger = require('../logger');

module.exports = {
	
	getUsersAnalytics: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AnalyticsFunctions.getUsersAnalytics()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	getSchedulePick: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AnalyticsFunctions.getSchedulePick()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	},
	
	getOccupancyRatio: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AnalyticsFunctions.getOccupancyRatio()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	}
	
};