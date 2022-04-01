var db = require('../dal');
var Promise = require('promise');
var logger = require('../logger');

module.exports = {
	
	getAreas: function() {	
	
		return new Promise(function(resolve, reject) {			
			db.AreaFunctions.getAreas()
				.done(function(data){
					resolve(data);
				},function(e){
					reject(e);
			});
		});
		
	}
	
};