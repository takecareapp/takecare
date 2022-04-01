var Promise = require('promise');
let assert = require('assert');
let staffs = require('../bl/staffs');
let area = require('../bl/area');
let branches = require('../bl/branches');
let clients = require('../bl/users'); 

let init = function () {
	return new Promise(function(resolve, reject) {				
		console.log('start init');
		let id = 'test';
		clients.setIsActiveClient(id).done(function(data){		
			console.info('finish init');
			resolve(data);
		},function(e){
			reject(e);
		});	
	});
};

beforeEach(async () => {
    await init();
});
 

//simple test
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {	
		assert.equal([1, 2, 3].indexOf(4), -1);		
    });
  });
});

describe('Staff', function() {
  describe('getProfessions()', function() {    
	it('Should return the professions', function() { 		
		return staffs.getProfessions().then(function(data){
			console.log(data)
			assert.notStrictEqual(data.length, 0);
		});
    });
  });
});

describe('Staff', function() {
  describe('getStaffs()', function() {    
	it('Should return the staffs', function() {		
		return staffs.getStaffs().then(function(data){
			console.log(data)
			assert.notStrictEqual(data.length, 0);
		});
    });
  });
});

describe('Area', function() {
  describe('getAreas()', function() {    
	it('Should return the areas', function() {  			
		return area.getAreas().then(function(data){
			console.log(data)
			assert.notStrictEqual(data.length, 0);
		});	
    });
  });
});

describe('Branches', function() {
  describe('getBranches()', function() {    
	it('Should return the branches', function() { 		
		return branches.getBranches().then(function(data){
			console.log(data)
			assert.notStrictEqual(data.length, 0);
		});	
    });
  });
});

describe('Clients', function() {
  describe('getClients()', function() {    
	it('Should return the clients', function() {					
		return clients.getClients().then(function(data){
			console.log(data)
			assert.notStrictEqual(data.length, 0);
		});	
    });
  });
});


describe('Clients', function() {
  describe('login()', function() {    
	it('Should return false because client doesn\'t exist', function() { 		
		var userName = 'shockomoko';
		var pass = 'shockomokopass';
		return clients.login(userName, pass).then(function(data){			
			assert.equal(data, false);
		});	
    });
  });
});

describe('Clients', function() {
  describe('login()', function() {    
	it('Should return data', function() { 		
		var userName = 'test';
		var pass = 'test';		
		return clients.login(userName, pass).then(function(data){	
			console.log(data);
			assert.equal(data[0].id, userName);
		});		
    });
  });
});



describe('Clients', function() {
  describe('addClient()', function() {    
	it("Should return error message:'Client id already exists'", function() {		
		var id = 'test';
		var firstName = 'test';
		var lastName = 'test'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.addClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){	
			console.log(data);
			assert.equal(data.error, 'already_exists');
		});	
    });
  });
});

describe('Clients', function() {
  describe('addClient()', function() {    
	it('Should return error because there is missing id', function() {		
		var id = null;
		var firstName = 'test';
		var lastName = 'test'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.addClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){
			assert.equal(1, 2);
		}, function(e) {
			console.log(e);			
			assert.equal(e.error, 'input_not_valid');
		});	
    });
  });
});

describe('Clients', function() {
  describe('addClient()', function() {    
	it('Should return error because there is missing firstName', function() {		
		var id = 'test'; 
		var firstName = null; 
		var lastName = 'test'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.addClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){
			assert.equal(1, 2);
		}, function(e) {
			console.log(e);			
			assert.equal(e.error, 'input_not_valid');
		});	
    });
  });
});

describe('Clients', function() {
  describe('addClient()', function() {    
	it('Should return error because there is missing lastName', function() {		
		var id = 'test'; 
		var firstName = 'test'; 
		var lastName = null; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.addClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){
			assert.equal(1, 2);
		}, function(e) {
			console.log(e);			
			assert.equal(e.error, 'input_not_valid');
		});	
    });
  });
});

describe('Clients', function() {
  describe('updateClient()', function() {    
	it('Sholud update client', function() {		
		var id = 'test';
		var firstName = 'test2';
		var lastName = 'test'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.updateClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){	
			console.log(data);
			assert.equal(data.length, [].length);
		});	
    });
  });
});

describe('Clients', function() {
  describe('updateClient()', function() {    
	it('Should not update client row and return error because there is missing id', function() {		
		var id = null;
		var firstName = 'test3'; 
		var lastName = 'test'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.updateClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){
			assert.equal(1, 2);
		}, function(e) {
			console.log(e);			
			assert.equal(e.error, 'input_not_valid');
		});	
    });
  });
});

describe('Clients', function() {
  describe('updateClient()', function() {    
	it('Should not update client row and return error because there is missing firstName', function() {		
		var id = 'test'; 
		var firstName = null;
		var lastName = 'test4'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.updateClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){
			assert.equal(1, 2);
		}, function(e) {
			console.log(e);			
			assert.equal(e.error, 'input_not_valid');
		});	
    });
  });
});

describe('Clients', function() {
  describe('updateClient()', function() {    
	it('Should not update client row and return error because there is missing lastName', function() {		
		var id = 'test'; 
		var firstName = 'test5';
		var lastName = null; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.updateClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){
			assert.equal(1, 2);
		}, function(e) {
			console.log(e);			
			assert.equal(e.error, 'input_not_valid');
		});	
    });
  });
});

describe('Clients', function() {
  describe('removeClient()', function() {    
	it('Should remove client', function() { 		 
		var id = 'test';
		return clients.removeClient(id).then(function(data){
			console.log(data);
			assert.equal(data.length, [].length);
		});		
    });
  });
});

describe('Clients', function() {
  describe('removeClient()', function() {    
	it('Should not remove client because the client not exist', function() { 		 
		var id = 'shockomoko';
		return clients.removeClient(id).then(function(data){
			console.log(data);
			assert.equal(data.error, 'not_exists');
		});		
    });
  });
});

describe('Clients', function() {
  describe('addClient()', function() {    
	it('Should add Client', function() {		
		var id = 'test';
		var firstName = 'test';
		var lastName = 'test'; 
		var address = 'test';
		var	phoneNumber = 'test'; 
		var	email  = 'test@test.com'; 
		var	password  = 'test';
		return clients.physicalRemoveClient(id).then(function(data){
			console.log(data);
			clients.addClient(id, firstName, lastName, address, phoneNumber, email, password).then(function(data){	
				console.log(data);
				assert.equal(data.length, [].length);
			});	
			
		});	
		
    });
  });
});

