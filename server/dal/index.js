var Pool = require('pg-pool')
var Promise = require('promise');
var logger = require('../logger');

var pool = new Pool({
	host: 'ruby.db.elephantsql.com',
	database: 'hjfttonp',
	user: 'hjfttonp',
	password: 'tyCCNOyqdZ1IPe8-yzjZFywVOPS4_Cnj',
	port: 5432,
	ssl: true,
	max: 80,
	idleTimeoutMillis: 999999,
	connectionTimeoutMillis: 999999
});


module.exports = {

    UserFunctions: {

        getUser: function(id, password) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select id, user_type, first_name, last_name from takecare.person where id = '${id}' and password = '${password}' and is_active = '1' limit 1`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		isExists: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select count(1) as num_of_users from takecare.person where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		addClient: function(id, firstName, lastName, address, phoneNumber, email, hash) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `INSERT INTO takecare.person (id, first_name, last_name, address, phone_number, is_active, user_type, email, password) VALUES ('${id}', '${firstName}', '${lastName}', '${address}', '${phoneNumber}', '1', 1, '${email}', '${hash}')`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		removeClient: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.person set is_active = '0', active_date = current_timestamp where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getClients: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select * from takecare.person where user_type = 1 and is_active = '1'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getDeletedClients: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select * from takecare.person where user_type = 1 and is_active <> '1'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		updateClient: function(id, firstName, lastName, address, phoneNumber, email) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.person set first_name = '${firstName}', last_name = '${lastName}', address = '${address}', phone_number = '${phoneNumber}', email = '${email}' where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		setIsActiveClient: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.person set is_active = '1', active_date = current_timestamp where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		physicalRemoveClient: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `delete from takecare.person where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        }
		
    },
	
	AppointmentsFunctions: {

        getAppointments: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
		select 
			queue.staff_id, queue.date, queue.hour, queue_status.name as status, queue.id, 
			staff.personal_information as doctor, branch.name as branch, profession.name as profession,
			case 
				when queue.hour <= 23 then 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD HH24:00')
				else 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD')
			end as "fullDate",
			case when queue.hour > 23 then 'stand_by_' || cast ((queue.hour - 24 + 1) as varchar(5)) else cast (queue.hour as varchar(5)) end as hour_desc
		from takecare.queue queue 
			join takecare.queue_status queue_status on queue.status = queue_status.code		 
					join takecare.staff staff on queue.staff_id = staff.id
						join takecare.branch branch on staff.branch = branch.code
							join takecare.profession profession on staff.profession = profession.code
		where 
			queue.id is not null and
			queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int)`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getNextFreeAppointments: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
		select 
			queue.staff_id, queue.date, queue.hour, queue_status.name as status, queue.id, 
			staff.personal_information as doctor, branch.name as branch, profession.name as profession,
			case 
				when queue.hour <= 23 then 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD HH24:00')
				else 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD')
			end as "fullDate",
			case when queue.hour > 23 then 'stand_by_' || cast ((queue.hour - 24 + 1) as varchar(5)) else cast (queue.hour as varchar(5)) end as hour_desc,
			to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD') as "date_formatted"
		from takecare.queue queue 
			join takecare.queue_status queue_status on queue.status = queue_status.code		 
					join takecare.staff staff on queue.staff_id = staff.id
						join takecare.branch branch on staff.branch = branch.code
							join takecare.profession profession on staff.profession = profession.code
		where 
			queue.id is null and
			queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int)
		order by 
			queue.date, queue.hour`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		isExists: function(staffId, date, hour, id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select count(1) as result from takecare.queue where staff_id = '${staffId}' and date = ${date} and hour = ${hour} and id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		isStandByexceeded: function(clientId, hour) {
           
            return new Promise(function(resolve, reject) { // return positve number if client stand by option is exceeded		
				pool.connect().then(client => {	
					query = `
		select count(1) as result where 5 <= (
			select 
				count(1) 
			from 
				takecare.queue
			where 
				queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int) and 
				queue.hour > 23 and 
				${hour} > 23
				and id = '${clientId}'
		)`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		isClientAlreadyScheduledAppointment: function(date, clientId, hour, staffId) {
           
            return new Promise(function(resolve, reject) { // return true if client already scheduled an appointment for this date		
				pool.connect().then(client => {	
					query = `
				select count(1) as result 
				from takecare.queue 
				where 
					(date = ${date} and hour = ${hour} and id = '${clientId}') or -- client already schedule appointment at the same date&hour
					(date = ${date} and staff_id = '${staffId}' and id = '${clientId}') or -- client already schedule appointment for the same doctor at the date
					(id = '${clientId}' and staff_id = '${staffId}' and queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int) and queue.hour <= 23 and ${hour} <= 23) or -- client alreday scheudle an regular appointment in the future
					(id = '${clientId}' and staff_id = '${staffId}' and queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int) and queue.hour <= 23 and date <= ${date}) or -- client already schedule an earlier appointment so future stand by appointment is not allowed
					(${hour} > 23 and date = ${date} and id = '${clientId}') -- client already scheudle an stand by appointment at the same date
				`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		isAppointmentAvailable: function(staffId, date, hour) {
           
            return new Promise(function(resolve, reject) {		
				pool.connect().then(client => {	
					query = `select count(1) as result from takecare.queue where date = ${date} and id is null and staff_id = '${staffId}' and hour = ${hour}`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		removeAppointment: function(staffId, date, hour, id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.queue set id = null where staff_id = '${staffId}' and date = ${date} and hour = ${hour} and id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		removeAppointmentForDeletedUser: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.queue set id = null where date >= cast(to_char(current_date, 'YYYYMMDD') as int) and id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows)
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		removeAppointmentAfterReschedule: function(staffId, date, clientId, hour) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.queue set id = null where staff_id = '${staffId}' and id = '${clientId}' and date >= cast(to_char(current_date, 'YYYYMMDD') as int) and not (date = ${date} and hour = ${hour})`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getStandByAppointments: function(staffId, date) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {						
					query = `
		select 
			distinct person.phone_number, 
			initcap(person.first_name) as first_name
		from 
			takecare.queue queue
				join takecare.person person on queue.id = person.id
		where 
			queue.id is not null and
			staff_id = '${staffId}' and 
			queue.date = ${date} and
			queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int) and
			hour > 23`;			
			
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows)
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		scheduleAppointment: function(staffId, date, hour, clientId) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.queue set id = '${clientId}', last_modified_date = current_timestamp where staff_id = '${staffId}' and date = ${date} and hour = ${hour} and id is null`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getPreviousAppointments: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
		select 
			queue.staff_id, queue.date, queue.hour, queue_status.name as status, queue.id, 
			staff.personal_information as doctor, branch.name as branch, profession.name as profession,
			case 
				when queue.hour <= 23 then 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD HH24:00')
				else 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD')
			end as "fullDate",
			case when queue.hour > 23 then 'stand_by_' || cast ((queue.hour - 24 + 1) as varchar(5)) else cast (queue.hour as varchar(5)) end as hour_desc
		from takecare.queue queue 
			join takecare.queue_status queue_status on queue.status = queue_status.code		 
					join takecare.staff staff on queue.staff_id = staff.id
						join takecare.branch branch on staff.branch = branch.code
							join takecare.profession profession on staff.profession = profession.code
		where 
			queue.id is not null and
			queue.date < cast(to_char(current_date, 'YYYYMMDD') as int)
		order by 
			queue.date desc, queue.hour desc`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getPreviousAppointmentsById: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
		select 
			queue.staff_id, queue.date, queue.hour, queue_status.name as status, queue.id, 
			staff.personal_information as doctor, branch.name as branch, profession.name as profession,
			case 
				when queue.hour <= 23 then 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD HH24:00')
				else 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD')
			end as "fullDate",
			case when queue.hour > 23 then 'stand_by_' || cast ((queue.hour - 24 + 1) as varchar(5)) else cast (queue.hour as varchar(5)) end as hour_desc
		from takecare.queue queue 
			join takecare.queue_status queue_status on queue.status = queue_status.code		 
					join takecare.staff staff on queue.staff_id = staff.id
						join takecare.branch branch on staff.branch = branch.code
							join takecare.profession profession on staff.profession = profession.code
		where 
			queue.id = '${id}' and
			queue.date < cast(to_char(current_date, 'YYYYMMDD') as int)
		order by 
			queue.date desc, queue.hour desc`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getNextAppointmentsById: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
		select 
			queue.staff_id, queue.date, queue.hour, queue_status.name as status, queue.id, 
			staff.personal_information as doctor, branch.name as branch, profession.name as profession,
			case 
				when queue.hour <= 23 then 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD HH24:00')
				else 
					to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD')
			end as "fullDate",
			case when queue.hour > 23 then 'stand_by_' || cast ((queue.hour - 24 + 1) as varchar(5)) else cast (queue.hour as varchar(5)) end as hour_desc,
			to_char(to_timestamp(queue.date || '_' || least(queue.hour, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD') as "date_formatted"
		from takecare.queue queue 
			join takecare.queue_status queue_status on queue.status = queue_status.code		 
					join takecare.staff staff on queue.staff_id = staff.id
						join takecare.branch branch on staff.branch = branch.code
							join takecare.profession profession on staff.profession = profession.code
		where 
			queue.id = '${id}' and
			queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int)`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getMessagesById: function(id) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
			select 
				staff_id,
				doctor,
				branch,
				profession,
				min(date_formatted) as date_formatted,
				min(full_date) as "fullDate",
				cast(to_char(to_timestamp(min(full_date), 'YYYY-MM-DD HH24:00'), 'YYYYMMDD') as int4)  as "date",
				cast(to_char(to_timestamp(min(full_date), 'YYYY-MM-DD HH24:00'), 'HH24') as int4)  as "hour"
			from (
				select 
					queue.staff_id, queue.date,
					staff.personal_information as doctor, branch.name as branch, profession.name as profession,			
					to_char(to_timestamp(queue.date || '_' || 1, 'YYYYMMDD_HH24'), 'YYYY-MM-DD') as "date_formatted",
					min(to_char(to_timestamp(queue.date || '_' || least(case when queue.id is null then queue.hour else 100 end, 23), 'YYYYMMDD_HH24'), 'YYYY-MM-DD HH24:00')) as "full_date",
					min(case when queue.id is null then queue.hour else 100 end) as hour,
					max(case when queue.id = '${id}' and queue.hour > 23 then 1 else 0 end) as is_stand_by
				from takecare.queue queue 		 
							join takecare.staff staff on queue.staff_id = staff.id
								join takecare.branch branch on staff.branch = branch.code
									join takecare.profession profession on staff.profession = profession.code
				where 
					queue.date >= cast(to_char(current_date, 'YYYYMMDD') as int)
				group by
					1,2,3,4,5,6
				having 
					max(case when queue.id = '${id}' and queue.hour > 23 then 1 else 0 end) = 1 and -- is_stand_by
					min(case when queue.id is null then queue.hour else 100 end) < 24 -- there is an available appointment
						
			) t
			group by 1,2,3,4
			order by 5 desc, 1 `;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows)
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        }
		
    },
	
	StaffsFunctions: {

        getProfessions: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select * from takecare.profession`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		addGeneralStaff: function(id, firstName, lastName, address, phoneNumber, email, hash) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `INSERT INTO takecare.person (id, first_name, last_name, address, phone_number, is_active, user_type, email, password) VALUES ('${id}', '${firstName}', '${lastName}', '${address}', '${phoneNumber}', '1', 3, '${email}', '${hash}')`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		addStaff: function(id, personalInfo, branch, profession) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `INSERT INTO takecare.staff (id, personal_information, branch, profession) VALUES ('${id}', '${personalInfo}', ${branch}, ${profession})`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getStaffs: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select s.id, p.first_name as "firstName", p.last_name as "lastName", p.phone_number as "phoneNumber", p.email, s.profession as "professionCode",pro.name as "professionName" ,s.branch as "branchCode", b.name as "branchName", s.personal_information as "personalInformation" from ((takecare.staff s join takecare.branch b on (s.branch = b.code)) join takecare.profession pro on (s.profession = pro.code)) join takecare.person p on (p.id = s.id) where p.user_type = 3 and is_active = '1'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		updateGeneralStaff: function(id, firstName, lastName, phoneNumber) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.person set first_name = '${firstName}', last_name = '${lastName}', phone_number = '${phoneNumber}' where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		updateStaff: function(id, personalInformation, branchCode, professionCode) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `update takecare.staff set personal_information = '${personalInformation}', branch = ${branchCode}, profession = ${professionCode} where id = '${id}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        }
		
    },
	
	BranchesFunctions: {

        isExists: function(branchName) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select count(1) as num_of_branches from takecare.branch where name = '${branchName}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {	
						client.release();
						logger.info(res.rows[0])
						resolve(res.rows[0]);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getBranches: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select b.code, b.name as "branchName", b.area_code as "areaCode", a.name as "areaCodeName" from takecare.branch b join takecare.area a on b.area_code = a.code`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		addBranch: function(branchName, areaCode) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `INSERT INTO takecare.branch (name, area_code) VALUES ('${branchName}', ${areaCode})`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		updateBranch: function(branchName, areaCode, oldBranchName) {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `UPDATE takecare.branch SET name = '${branchName}', area_code = ${areaCode} where name = '${oldBranchName}'`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release();
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        }
		
    },
	
	
	AreaFunctions: {

        getAreas: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `select * from takecare.area`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        }
		
    },
	
	AnalyticsFunctions: {

        getUsersAnalytics: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
				select 
					initcap(to_char(active_date, 'month')) as "month", 
					to_char(active_date, 'MM') as month_order,
					sum(case when is_active = '1' then 1 else 0 end) as "users_new",
					sum(case when is_active = '0' then 1 else 0 end) as "users_left"
				FROM takecare.person 
				where 
					active_date >= CURRENT_DATE - INTERVAL '1 year'
				group by 1, 2 
				order by 2`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getSchedulePick: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
				SELECT to_char(last_modified_date, 'HH24') as "hour", count(1) as "count"
				FROM takecare.queue
				group by 1
				order by 1
				`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        },
		
		getOccupancyRatio: function() {
           
            return new Promise(function(resolve, reject) {				
				pool.connect().then(client => {	
					query = `
				select b."name" || ' - ' || p."name" as "branch_profession", round(sum(case when q.id is not null then 1 else 0 end) / cast (sum(1) as float) * 100)
				FROM takecare.queue q
					join takecare.staff s on(q.staff_id = s.id)
						join takecare.branch b on (s.branch = b.code)
							join takecare.profession p on(p.code = s.profession)

				where q."date" >= cast(to_char(current_date, 'YYYYMMDD') as int4) 
				group by 1
				order by 2 desc
				limit 5`;
					logger.info(`running: ${query}`);
					client.query(query).then(res => {								
						client.release()
						resolve(res.rows);
					})
					.catch(e => {						
						client.release();						
						reject(e);
					})					
				})
            });
			
        }
		
    }
	
};