
angular.module('takecareapp.factory', []).factory('AppFactory', function($http) {
	return {
		login: function(id, password){
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/users/login',
				cache: false,
				data: {
					id: id,
					password: password
				}
			});
		},

		logout: function () {
			return $http({ // ajax http call
			  method: 'POST',
			  url: 'https://takecare.herokuapp.com/users/logout',
			  cache: false,
			  data: {
			  }
			});
		},

		getPreviousAppointmentsById: function(id) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/appointments/get_previous_appointments_by_id',
				cache: false,
				data: {
					id: id
				}
			});
		},

		getNextAppointmentsById: function(id) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/appointments/get_next_appointments_by_id',
				cache: false,
				data: {
					id: id
				}
			});
		},

		removeAppointment: function(data) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/appointments/remove_appointment',
				cache: false,
				data: {
					staffId: data.staff_id,
					date: data.date,
					hour: data.hour,
					id: data.id
				}
			});
		},

		getNextFreeAppointments: function(data) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/appointments/get_next_free_appointments',
				cache: false,
				data: {

				}
			});
		},

		getBranches: function(data) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/branches/get_branches',
				cache: false,
				data: {

				}
			});
		},

		getProfessions: function(data) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/staffs/get_professions',
				cache: false,
				data: {

				}
			});
		},

		getStaffs: function(data) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/staffs/get_staffs',
				cache: false,
				data: {

				}
			});
		},

		getAreas: function(data) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/area/get_areas',
				cache: false,
				data: {

				}
			});
		},

		scheduleAppointment: function (data) {
			return $http({ // ajax http call
			  method: 'POST',
			  url: 'https://takecare.herokuapp.com/appointments/schedule_appointment',
			  cache: false,
			  data: {
				clientId: data.client,
				staffId: data.staff,
				date: data.date,
				hour: data.hour
			  }
			});
		},

		getMessagesById: function(id) {
			return $http({
				method: 'POST',
				url: 'https://takecare.herokuapp.com/appointments/get_messages_by_id',
				cache: false,
				data: {
					id: id
				}
			});
		},

		rescheduleAppointment: function (data) {
			return $http({ // ajax http call
			  method: 'POST',
			  url: 'https://takecare.herokuapp.com/appointments/reschedule_appointment',
			  cache: false,
			  data: {
				clientId: data.client,
				staffId: data.staff_id,
				date: data.date,
				hour: data.hour
			  }
			});
		},

	}
});
