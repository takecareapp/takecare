angular.module('takecareapp.controllers', ['takecareapp.factory'])

  .controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $ionicHistory, $ionicPopup, $timeout, $state, AppFactory, $ionicPlatform) {

    /**
     * initApp :: function
     * description: Main function that initializes the app
     */
    $scope.initApp = function () {  // defaults and inits
      $scope.socket = {};
	  $scope.loginData = {};
	  $scope.formData = {};
      $rootScope.user = null;
      $rootScope.userId = -1;
    };

    /**
     * login :: function
     * description: Login Handler function
     */
    $scope.login = function () {

      var userId = $scope.loginData.userId;
      var password = $scope.loginData.password;
      if (userId && password && userId.length > 0 && password.length > 0) {
        AppFactory.login(userId, password)
          .success(function (data) {
            if (data.status && data.is_exists) {
              $rootScope.userId = data.id;
              $rootScope.user = data.name;
			  localStorage.userId = $rootScope.userId;
			  $scope.initPreviousAppointments();
			  $scope.initNextAppointments();
			  $scope.initScheduleAppointment();
			  $scope.initMessages();
              $state.go('app.login');
            }
            else {
              $rootScope.alertPopup("Incorrect Username or Password");
            }
          })
          .error(function (e) {
            console.error(e);
            $rootScope.alertPopup("Error Logging In");
          });
      }
      else {
        $rootScope.alertPopup("Please fill in these required fields");
      }
    };

	/**
     * logout :: function
     * description: Logs out the current user
     */
    $scope.logout = function () {
      $rootScope.userId = -1;
      $rootScope.user = null;
      $scope.loginData = {};
      $scope.tasks = [];
      localStorage.removeItem('userId');
      $rootScope.alertPopup("Logged out successfully");

	  AppFactory.logout()
          .success(function (data) {
			$state.go('app.login');
          })
          .error(function (e) {
            console.error(e);
            $state.go('app.login');
          });
    };

	/**
     * initPreviousAppointments :: function
     * description: load previous appointments
     */
    $scope.initPreviousAppointments = function () {
	  AppFactory.getPreviousAppointmentsById($rootScope.userId)
          .success(function (data) {
			$rootScope.previousAppointments = data.data;
          })
          .error(function (e) {
            console.error(e);
          });
    };

	/**
     * initNextAppointments :: function
     * description: load next appointments
     */
    $scope.initNextAppointments = function () {
	  AppFactory.getNextAppointmentsById($rootScope.userId)
          .success(function (data) {
			$rootScope.nextAppointments = data.data;
          })
          .error(function (e) {
            console.error(e);
          });
    };

	/**
     * initMessages :: function
     * description: load messages
     */
    $scope.initMessages = function () {
	  AppFactory.getMessagesById($rootScope.userId)
          .success(function (data) {
			$rootScope.messages = data.data;
          })
          .error(function (e) {
            console.error(e);
          });
    };

	/**
     * removeAppointment :: function
     * description: remove an appointment
     */
    $scope.removeAppointment = function (index) {

	  var myPopup = $ionicPopup.show({
        template: 'Are You Sure?',
        title: 'About To Remove',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Remove</b>',
            type: 'button-assertive',
            onTap: function (e) {
               AppFactory.removeAppointment($rootScope.nextAppointments[index])
				  .success(function (data) {
					 $rootScope.nextAppointments.splice(index, 1);
					 $scope.formData = {};
					 $scope.initScheduleAppointment();
					 $scope.initMessages();
				  })
				  .error(function (e) {
					console.error(e);
				  });
            }
          }
        ]
      });

      myPopup.then(function (res) {

      });

      $timeout(function () {
        myPopup.close(); //close the popup after 10 seconds for some reason
      }, 10000);

    };

	/**
     * moreInfoNextAppointment :: function
     * description: more information about the appointment
     * @param index
     */
    $scope.moreInfoNextAppointment = function (index) {
      navigator.vibrate(300);
      var popUp = $ionicPopup.alert({
        title: "More Information",
        template: '<div></div>',
        buttons: [{
          text: 'OK',
          type: 'button-assertive'
        }]
      });
      popUp.then(function (res) {
        // console.log('Thank you for not eating my delicious ice cream cone');
      });
      document.getElementsByClassName("popup")[0].style.maxHeight = '100%';
      document.getElementsByClassName("popup")[0].style.height = '400px';
      document.getElementsByClassName("popup")[0].style.maxWidth = '100%';
      document.getElementsByClassName("popup")[0].style.width = '300px';
      document.getElementsByClassName("popup-body")[0].style.height = '100%';
      setTimeout(function () {
        var div = document.createElement("div");
        div.setAttribute("id", "previousAppointmentPopUp");
        div.style.height = '100%';

		var fullDate = $rootScope.nextAppointments[index]['fullDate'];
		var branch = $rootScope.nextAppointments[index]['branch'];
		var status = $rootScope.nextAppointments[index]['status'];
		var doctor = $rootScope.nextAppointments[index]['doctor'];
		var profession = $rootScope.nextAppointments[index]['profession'];

		div.innerText = `
		Date: ${fullDate}

		Status: ${status}

		Doctor Information: ${doctor}

		Branch: ${branch}

		Profession: ${profession}
		`
        document.getElementsByClassName("popup-body")[0].appendChild(div);
      }, 0);
    };

	/**
     * moreInfoPreviousAppointment :: function
     * description: more information about the appointment
     * @param index
     */
    $scope.moreInfoPreviousAppointment = function (index) {
      navigator.vibrate(300);
      var popUp = $ionicPopup.alert({
        title: "More Information",
        template: '<div></div>',
        buttons: [{
          text: 'OK',
          type: 'button-assertive'
        }]
      });
      popUp.then(function (res) {
        // console.log('Thank you for not eating my delicious ice cream cone');
      });
      document.getElementsByClassName("popup")[0].style.maxHeight = '100%';
      document.getElementsByClassName("popup")[0].style.height = '400px';
      document.getElementsByClassName("popup")[0].style.maxWidth = '100%';
      document.getElementsByClassName("popup")[0].style.width = '300px';
      document.getElementsByClassName("popup-body")[0].style.height = '100%';
      setTimeout(function () {
        var div = document.createElement("div");
        div.setAttribute("id", "previousAppointmentPopUp");
        div.style.height = '100%';

		var fullDate = $rootScope.previousAppointments[index]['fullDate'];
		var branch = $rootScope.previousAppointments[index]['branch'];
		var status = $rootScope.previousAppointments[index]['status'];
		var doctor = $rootScope.previousAppointments[index]['doctor'];
		var profession = $rootScope.previousAppointments[index]['profession'];

		div.innerText = `
		Date: ${fullDate}

		Status: ${status}

		Doctor Informatiom: ${doctor}

		Branch: ${branch}

		Profession: ${profession}
		`
        document.getElementsByClassName("popup-body")[0].appendChild(div);
      }, 0);
    };

	/**
     * moreInfoMessages :: function
     * description: more information about the messages
     * @param index
     */
    $scope.moreInfoMessages = function (index) {
      navigator.vibrate(300);
      var popUp = $ionicPopup.alert({
        title: "More Information",
        template: '<div></div>',
        buttons: [{
          text: 'OK',
          type: 'button-assertive'
        }]
      });
      popUp.then(function (res) {
        // console.log('Thank you for not eating my delicious ice cream cone');
      });
      document.getElementsByClassName("popup")[0].style.maxHeight = '100%';
      document.getElementsByClassName("popup")[0].style.height = '400px';
      document.getElementsByClassName("popup")[0].style.maxWidth = '100%';
      document.getElementsByClassName("popup")[0].style.width = '300px';
      document.getElementsByClassName("popup-body")[0].style.height = '100%';
      setTimeout(function () {
        var div = document.createElement("div");
        div.setAttribute("id", "previousAppointmentPopUp");
        div.style.height = '100%';

		var fullDate = $rootScope.messages[index]['fullDate'];
		var branch = $rootScope.messages[index]['branch'];
		var status = 'on time'
		var doctor = $rootScope.messages[index]['doctor'];
		var profession = $rootScope.messages[index]['profession'];

		div.innerText = `
		Date: ${fullDate}

		Status: ${status}

		Doctor Informatiom: ${doctor}

		Branch: ${branch}

		Profession: ${profession}
		`
        document.getElementsByClassName("popup-body")[0].appendChild(div);
      }, 0);
    };

	/**
     * initScheduleAppointment :: function
     * description: load next available appointments
     */
    $scope.initScheduleAppointment = function () {

      AppFactory.getNextFreeAppointments().success(function (data) {

		 $rootScope.appointments = (data.status) ? data.data : [];

		 AppFactory.getBranches().success(function (data) {

			$rootScope.branches = (data.status) ? data.data : [];

			AppFactory.getProfessions().success(function (data) {

				$rootScope.professions = (data.status) ? data.data : [];

				AppFactory.getStaffs().success(function (data) {

					$rootScope.staffs = (data.status) ? data.data : [];

					AppFactory.getAreas().success(function (data) {

						$rootScope.areas = (data.status) ? data.data : [];

					  }).error(function (e) {
						console.error(e);
					  });

				  }).error(function (e) {
					console.error(e);
				  });

			  }).error(function (e) {
				console.error(e);
			  });

		  }).error(function (e) {
			console.error(e);
		  });

	  }).error(function (e) {
		console.error(e);
	  });

    };

	/**
     * scheduleAppointment :: function
     * description: schedule an appointment
     */
    $scope.scheduleAppointment = function () {
		var formData = $scope.formData;
		if (formData && formData.area && formData.branch &&
			formData.profession && formData.staff && formData.date && formData.hour) {
		  formData.client = $rootScope.userId;
          AppFactory.scheduleAppointment(formData)
            .success(function (data) {
              if (data.status) {
				if (data.data && data.data.error && data.data.error === "already_exists") {
					$rootScope.alertPopup("appointment already had been scheduled");
				} else if (data.data && data.data.error && data.data.error === "stand_by_exceeded") {
					$rootScope.alertPopup("only 5 stand by appointments is possible");
				}  else if (data.data && data.data.error && data.data.error === "something_went_wrong") {
					$rootScope.alertPopup("something went wrong");
				}else {
					$scope.formData = {};
					$rootScope.alertPopup("Successfully Scheduled");
					$scope.initScheduleAppointment();
					$scope.initNextAppointments();
					$scope.initMessages();
				}
              }
              else {
                $rootScope.alertPopup("Error schedule an appointment");
              }
            })
            .error(function (e) {
			  console.log(e);
              $rootScope.alertPopup("Error schedule an appointment");
            })
        }
        else {
		  $rootScope.alertPopup("Please fill all necessary fields");
        }
    };

	/**
     * rescheduleAppointment :: function
     * description: reschedule an appointment
     */
    $scope.rescheduleAppointment = function (index) {

	  var myPopup = $ionicPopup.show({
        template: 'Are You Sure?',
        title: 'About To Reschedule',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Schedule</b>',
            type: 'button-assertive',
            onTap: function (e) {
			   $rootScope.messages[index].client = $rootScope.userId;
               AppFactory.rescheduleAppointment($rootScope.messages[index])
				  .success(function (data) {
					if (data.status) {
						if (data.data && data.data.error && data.data.error === "already_exists") {
							$rootScope.alertPopup("appointment already had been scheduled");
							$scope.initScheduleAppointment();
							$scope.initNextAppointments();
							$scope.initMessages();
						} else if (data.data && data.data.error && data.data.error === "something_went_wrong") {
							$rootScope.alertPopup("something went wrong");
							$scope.initScheduleAppointment();
							$scope.initNextAppointments();
							$scope.initMessages();
						} else {
							$scope.formData = {};
							$rootScope.alertPopup("Successfully Scheduled");
							$scope.initScheduleAppointment();
							$scope.initNextAppointments();
							$scope.initMessages();
						}
					} else {
						$rootScope.alertPopup("something went wrong");
						$scope.initScheduleAppointment();
						$scope.initNextAppointments();
						$scope.initMessages();
					}

				  })
				  .error(function (e) {
					console.error(e);
					$rootScope.alertPopup("something went wrong");
					$scope.initScheduleAppointment();
					$scope.initNextAppointments();
					$scope.initMessages();
				  });
            }
          }
        ]
      });

	   myPopup.then(function (res) {

	  });

      $timeout(function () {
        myPopup.close(); //close the popup after 10 seconds for some reason
      }, 10000);

    };

	/**
     * alertPopup :: function
     * description: Generic function for Ionic Alert Popup
     */
    $rootScope.alertPopup = function (title, subtitle, callback) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: subtitle,
        buttons: [
          {
            text: 'OK',
            type: 'button-assertive'
          }
        ]
      });

      alertPopup.then(function (res) {
        if (callback) {
          callback(res);
        }
      });
    };

    // Trigger App on js load
    $scope.initApp();
  });
