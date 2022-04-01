(function (app) {

  app.controller('MainCtrl', ['$rootScope', '$scope', '$window', '$location', '$routeParams', '$route', 'Factory', '$interval', '$timeout', '$document',
    function ($rootScope, $scope, $window, $location, $routeParams, $route, Factory, $interval, $timeout, $document) {

      var mCtrl = this;

      if (!$rootScope.user) {
        $rootScope.userName = '';
        $rootScope.userId = -1;
        $rootScope.user = {};
        $rootScope.loginData = {};
      }
	  
	  mCtrl.restEditMode = function () {mCtrl.editMode = false;}
	  
      mCtrl.doLogin = function () {
        var userId = $rootScope.loginData.userId;
        var password = $rootScope.loginData.password;
        if (userId && password && userId.length > 0 && password.length > 0) {
          Factory.loginUser(userId, password)
            .success(function (data) {
              if (data.status && data.is_exists) {
                if (data.user_type !== 2) {
                  $rootScope.loginData.errMsg = "You don't have permission to enter the admin panel";
                  $rootScope.user = {};
                  $rootScope.userId = -1;
                  $rootScope.userName = '';
                }
                else {
                  $rootScope.userId = data.id;
                  $rootScope.user = data.name;
                  $rootScope.userName = data.name;
                  $location.path('/home');
                  localStorage.userId = $rootScope.userId;
                }
              }
              else {
                $rootScope.loginData.errMsg = "Incorrect Username or Password";
              }
            })
            .error(function (e) {
              console.log(e);
              $rootScope.loginData.errMsg = "Error Logging In";
            });
        }
        else {
          $rootScope.loginData.errMsg = "Please fill in these required fields";
        }
      };

      mCtrl.initAreas = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          var data = $route.current.locals.initData;
          if (data.status) {
            mCtrl.areas = $route.current.locals.initData.data;			
          }
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };

	  mCtrl.initBranchList = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          var data = $route.current.locals.initData;
          if (data.status) {			  
            mCtrl.branchList = $route.current.locals.initData.data;			
			Factory.getAreas().success(function (data) {
			  mCtrl.areas = (data.status) ? data.data : [];			
            });
          }
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.initAddStaff = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getBranches().success(function (data) {
			  mCtrl.branches = (data.status) ? data.data : [];				
			  Factory.getProfessions().success(function (data) {
				  mCtrl.professions = (data.status) ? data.data : [];				
			  });
		  });
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.initClients = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getClients().success(function (data) {
			  mCtrl.clients = (data.status) ? data.data : [];
		  });
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.initAppointments = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getAppointments().success(function (data) {
			  mCtrl.appointments = (data.status) ? data.data : [];
		  });
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.initScheduleAppointment = function () {
        $rootScope.layout.loading = true;
		$rootScope.showSchedulePage = false;
		mCtrl.restEditMode();
        try {
          Factory.getNextFreeAppointments().success(function (data) {
			  mCtrl.appointments = (data.status) ? data.data : [];
			  Factory.getClients().success(function (data) {
				  mCtrl.clients = (data.status) ? data.data : [];
				  Factory.getBranches().success(function (data) {
					  mCtrl.branches = (data.status) ? data.data : [];
					  Factory.getProfessions().success(function (data) {
						  mCtrl.professions = (data.status) ? data.data : [];
						  Factory.getStaffs().success(function (data) {
							  mCtrl.staffs = (data.status) ? data.data : [];
							  Factory.getAreas().success(function (data) {
								  mCtrl.areas = (data.status) ? data.data : [];
								  $rootScope.layout.loading = false;
								  $rootScope.showSchedulePage = true;
							  });
						  });			  
					  });
				  });
			  });
		  });
        }
        catch (e) {
          console.log(e);
		  $rootScope.showSchedulePage = true;
		  $rootScope.layout.loading = false;
        }        
      };
	  
	  mCtrl.scheduleAppointment = function () {
        var formData = $rootScope.formData;
		if (formData && formData.client && formData.area && formData.branch && 
			formData.profession && formData.staff && formData.date && formData.hour) {
          Factory.scheduleAppointment(formData)
            .success(function (data) {				
              if (data.status) {
				if (data.data && data.data.error && data.data.error === "already_exists") {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "appointment already had been scheduled";
				} else if (data.data && data.data.error && data.data.error === "something_went_wrong") {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "something went wrong";
				} else if (data.data && data.data.error && data.data.error === "stand_by_exceeded") {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "only 5 stand by appointments is possible";
				} else {
					$rootScope.formData.errMsg = null;
					$rootScope.formData = {};
					$rootScope.formData.successMsg = "Successfully Scheduled";
					 mCtrl.initScheduleAppointment();
				}
              }
              else {
                $rootScope.formData.successMsg = null;
                $rootScope.formData.errMsg = "Error schedule an appointment";
              }
            })
            .error(function (e) {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error schedule an appointment";
              console.log(e);
            })
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
      };
	  
	  mCtrl.initPreviousAppointments = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getPreviousAppointments().success(function (data) {
			  mCtrl.prevAppointments = (data.status) ? data.data : [];
		  });
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.initStaffs = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getStaffs().success(function (data) {
			  mCtrl.staffs = (data.status) ? data.data : [];
			  Factory.getBranches().success(function (data) {
				  mCtrl.branches = (data.status) ? data.data : [];				
				  Factory.getProfessions().success(function (data) {
					  mCtrl.professions = (data.status) ? data.data : [];				
				  });
			  });
		  });
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.initDeletedClients = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getDeletedClients().success(function (data) {
			  mCtrl.clients = (data.status) ? data.data : [];			
		  });
        }
        catch (e) {
          console.log(e);
        }
        $rootScope.layout.loading = false;
      };	  
	  
	  mCtrl.addBranch = function () {
        var formData = $rootScope.formData;
        if (formData && formData.branchName && formData.areaCode) {
          Factory.addBranch(formData)
            .success(function (data) {				
              if (data.status) {
				if (data.data && data.data.error && data.data.error === "already_exists") {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "Branch already exists";
				} else {
					$rootScope.formData.errMsg = null;
					$rootScope.formData = {};
					$rootScope.formData.successMsg = "Successfully Added";
				}
              }
              else {
                $rootScope.formData.successMsg = null;
                $rootScope.formData.errMsg = "Error adding new branch";
              }
            })
            .error(function (e) {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error adding new branch";
              console.log(e);
            })
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
      };
	  
	  mCtrl.updateBranch = function () {
        var branch = mCtrl.branchList[mCtrl.currentUserIndex];
        if (branch && branch.newBranchName && branch.newBranchName.length > 0 && branch.newAreaCode) {
          Factory.updateBranch(branch)
            .success(function (data) {
              if (data.status) {				  
				if (data.data && data.data.error && data.data.error === "already_exists") {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "Branch already exists";
				} else {
					$rootScope.formData.errMsg = null;
					$rootScope.formData = {};
					$rootScope.formData.successMsg = "Changed Successfully";
					try {
						branch.branchName = branch.newBranchName;
						branch.areaCode = branch.newAreaCode;
						for (var i = 0; i < mCtrl.areas.length; i++) {
							if (mCtrl.areas[i].code == branch.newAreaCode) {
								branch.areaCodeName = mCtrl.areas[i].name;
								break;
							}
						}
					branch.newBranchName = '';	
					branch.newAreaCode = '';						
					}
					catch (e) {
					}
				}
                
              }
              else {
                $rootScope.formData.successMsg = null;
                $rootScope.formData.errMsg = "Error editing branch";
              }
            })
            .error(function (e) {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error editing branch";
              console.log(e);
            });
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
        mCtrl.closeBlocker();
      };
	  
	  
	  mCtrl.clientValidation = function (firstName, lastName, phoneNumber, password) {
		
			  
			var letters = /^[A-Za-z]+$/;
			if (!letters.test(firstName)) {
				$rootScope.formData.successMsg = null;
				$rootScope.formData.errMsg = "First name is not valid";
				return false;
			}

			if (!letters.test(lastName)) {
				$rootScope.formData.successMsg = null;
				$rootScope.formData.errMsg = "Last name is not valid";
				return false;
			}
			
		  
		  if (isNaN(phoneNumber.replace(/-/g, '').replace(/\+/g, ''))) {
		    $rootScope.formData.successMsg = null;
			$rootScope.formData.errMsg = "Phone number is not valid";
			return false;
		  }
		  
		  
		  if (password) {
		   if(password.length < 8) {
			$rootScope.formData.successMsg = null;
			$rootScope.formData.errMsg = "Password must has at least 8 characters";
			return false;   
		   }
			  
		  }
			   
		  return true;
	  };
	  
	  
	  mCtrl.addClient = function () {
        var formData = $rootScope.formData;
        if (formData && formData.id && formData.firstName && formData.lastName && formData.address &&
				formData.phoneNumber && formData.email && formData.password) {
		  if (mCtrl.clientValidation(formData.firstName, formData.lastName, formData.phoneNumber, formData.password)) {
			 Factory.addClient(formData)
				.success(function (data) {				
				  if (data.status) {
					if (data.data && data.data.error && data.data.error === "already_exists") {
						$rootScope.formData.successMsg = null;
						$rootScope.formData.errMsg = "Client already exists";
					} else {
						$rootScope.formData.errMsg = null;
						$rootScope.formData = {};
						$rootScope.formData.successMsg = "Successfully Added";
					}
				  }
				  else {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "Error adding new client";
				  }
				})
				.error(function (e) {
				  $rootScope.formData.successMsg = null;
				  $rootScope.formData.errMsg = "Error adding new client";
				  console.log(e);
				})
		  }
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
      };
	  
	  mCtrl.addStaff = function () {
        var formData = $rootScope.formData;
        if (formData && formData.id && formData.firstName && formData.lastName && formData.address &&
				formData.phoneNumber && formData.email && formData.password && formData.personalInfo && 
					formData.branch && formData.profession) {
	    if (mCtrl.clientValidation(formData.firstName, formData.lastName, formData.phoneNumber, formData.password)) {	
			  Factory.addStaff(formData)
				.success(function (data) {				
				  if (data.status) {
					if (data.data && data.data.error && data.data.error === "already_exists") {
						$rootScope.formData.successMsg = null;
						$rootScope.formData.errMsg = "Staff already exists";
					} else {
						$rootScope.formData.errMsg = null;
						$rootScope.formData = {};
						$rootScope.formData.successMsg = "Successfully Added";
					}
				  }
				  else {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "Error adding new staff";
				  }
				})
				.error(function (e) {
				  $rootScope.formData.successMsg = null;
				  $rootScope.formData.errMsg = "Error adding new staff";
				  console.log(e);
				})
    	   }	
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
      };	  
	  
	  mCtrl.removeClient = function (index) {
        Factory.removeClient(mCtrl.clients[index].id)
          .success(function (data) {
            if (data.status) {
              $rootScope.formData.errMsg = null;
              $rootScope.formData = {};
              $rootScope.formData.successMsg = "Successfully Removed";
              try {
                mCtrl.clients.splice(index, 1);
              }
              catch (e) {
              }
            }
            else {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error removing client";
            }
          })
          .error(function (e) {
            $rootScope.formData.successMsg = null;
            $rootScope.formData.errMsg = "Error removing client";
            console.log(e);
          });
      };
	  
	  mCtrl.removeAppointment = function (index) {		
		var staffId = mCtrl.appointments[index].staff_id;
		var date = mCtrl.appointments[index].date;
		var hour = mCtrl.appointments[index].hour;
		var id = mCtrl.appointments[index].id;
        Factory.removeAppointment(staffId, date, hour, id)
          .success(function (data) {
            if (data.status) {
              $rootScope.formData.errMsg = null;
              $rootScope.formData = {};
              $rootScope.formData.successMsg = "Successfully Removed";
              try {
                mCtrl.appointments.splice(index, 1);
              }
              catch (e) {
              }
            }
            else {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error removing appointment";
            }
          })
          .error(function (e) {
            $rootScope.formData.successMsg = null;
            $rootScope.formData.errMsg = "Error removing appointment";
            console.log(e);
          });
      };
	  
	  mCtrl.removeStaff = function (index) {
        Factory.removeClient(mCtrl.staffs[index].id)
          .success(function (data) {
            if (data.status) {
              $rootScope.formData.errMsg = null;
              $rootScope.formData = {};
              $rootScope.formData.successMsg = "Successfully Removed";
              try {
                mCtrl.staffs.splice(index, 1);
              }
              catch (e) {
              }
            }
            else {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error removing staff";
            }
          })
          .error(function (e) {
            $rootScope.formData.successMsg = null;
            $rootScope.formData.errMsg = "Error removing staff";
            console.log(e);
          });
      };
	  
	  mCtrl.updateClient = function () {
        var client = mCtrl.clients[mCtrl.currentUserIndex];
        if (client && client.newFirstName && client.newLastName && client.newPhoneNumber
				&& client.newAddress && client.newEmail) {
		  if (mCtrl.clientValidation(client.newFirstName, client.newLastName, client.newPhoneNumber, '')) {		
			  Factory.updateClient(client)
				.success(function (data) {
				  if (data.status) {				  
					$rootScope.formData.errMsg = null;
						$rootScope.formData = {};
						$rootScope.formData.successMsg = "Changed Successfully";
						try {
						client.first_name = client.newFirstName;
						client.last_name = client.newLastName;
						client.phone_number = client.newPhoneNumber;		
						client.address = client.newAddress;
						client.email = client.newEmail;
										
						client.newFirstName = '';	
						client.newLastName = '';	
						client.newPhoneNumber = '';		
						client.newAddress = '';	
						client.newEmail = '';				
						}
						catch (e) {
						}                
				  }
				  else {
					$rootScope.formData.successMsg = null;
					$rootScope.formData.errMsg = "Error editing client";
				  }
				})
				.error(function (e) {
				  $rootScope.formData.successMsg = null;
				  $rootScope.formData.errMsg = "Error editing client";
				  console.log(e);
				});
		  }
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
        mCtrl.closeBlocker();
      };
	  
	  mCtrl.setIsActiveClient = function () {
		var last_index = mCtrl.currentUserIndex;
        var client = mCtrl.clients[mCtrl.currentUserIndex];
        if (client && client.newIsActive) {
          Factory.setIsActiveClient(client)
            .success(function (data) {
              if (data.status) {				  
				$rootScope.formData.errMsg = null;
				$rootScope.formData = {};
				$rootScope.formData.successMsg = "Successfully Changed";
				try {
					mCtrl.clients.splice(last_index, 1);
				}
				catch (e) {
				}           
              }
              else {
                $rootScope.formData.successMsg = null;
                $rootScope.formData.errMsg = "Error editing client";
              }
            })
            .error(function (e) {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error editing client";
              console.log(e);
            });
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
        mCtrl.closeBlocker();
      };
	  
	  mCtrl.updateStaff = function () {
        var staff = mCtrl.staffs[mCtrl.currentUserIndex];
        if (staff && staff.newFirstName && staff.newLastName && staff.newPhoneNumber
				&& staff.newPersonalInformation && staff.newBranchCode && staff.newProfessionCode) {
          Factory.updateStaff(staff)
            .success(function (data) {
              if (data.status) {				  
				$rootScope.formData.errMsg = null;
					$rootScope.formData = {};
					$rootScope.formData.successMsg = "Changed Successfully";
					try {
					staff.firstName = staff.newFirstName;
					staff.lastName = staff.newLastName;
					staff.phoneNumber = staff.newPhoneNumber;		
					staff.personalInformation = staff.newPersonalInformation;
				
					for (var i = 0; i < mCtrl.branches.length; i++) {
						if (mCtrl.branches[i].code == staff.newBranchCode) {
							staff.branchName = mCtrl.branches[i].branchName;
							break;
						}
					}
					
					for (var i = 0; i < mCtrl.professions.length; i++) {
						if (mCtrl.professions[i].code == staff.newProfessionCode) {
							staff.professionName = mCtrl.professions[i].name;
							break;
						}
					}
						
									
					staff.newFirstName = '';	
					staff.newLastName = '';						
					staff.newPhoneNumber = '';	
					staff.newPersonalInformation= '';	
					staff.newBranchCode	= '';
					staff.newProfessionCode	= '';						
					}
					catch (e) {
					}                
              }
              else {
                $rootScope.formData.successMsg = null;
                $rootScope.formData.errMsg = "Error editing client";
              }
            })
            .error(function (e) {
              $rootScope.formData.successMsg = null;
              $rootScope.formData.errMsg = "Error editing client";
              console.log(e);
            });
        }
        else {
          $rootScope.formData.successMsg = null;
          $rootScope.formData.errMsg = "Please fill all necessary fields";
        }
        mCtrl.closeBlocker();
      };
	  
	  mCtrl.initAnalytics = function () {
        $rootScope.layout.loading = true;
		mCtrl.restEditMode();
        try {
          Factory.getUsersAnalytics().success(function (data) {
			  mCtrl.usersAnalytics = (data.status) ? data.data : [];
			  var lables = [];
			  var usersNewData = [];
			  var usersLeftData = [];
			  for (i = 0; i < mCtrl.usersAnalytics.length; i++) {
				  lables[i] = mCtrl.usersAnalytics[i].month.trim();
				  usersNewData[i] = Number(mCtrl.usersAnalytics[i].users_new);
				  usersLeftData[i] = Number(mCtrl.usersAnalytics[i].users_left);
			  }			  
			  var myChart = new Chart(document.getElementById("myChart"), {
				"type": "line",
				"data": {
					"labels": lables,
					"datasets": [{
							"label": "New Users",
							"data": usersNewData,
							"fill": false,
							"borderColor": "rgb(75, 192, 192)",
							"lineTension": 0.1
						},{
							"label": "Abandoned Users",
							"data": usersLeftData,
							"fill": false,
							"borderColor": "rgb(192, 93, 75)",
							"lineTension": 0.1
						}
					]
				},
				"options": {}
			});
			
			Factory.getSchedulePick().success(function (data) {
			  mCtrl.schedulePick = (data.status) ? data.data : [];	
				
			  var metrics = Array.from(new Array(24), (x,i) => []);
			  
			  for (i = 0; i < metrics.length; i++) {
				  metrics[i] = Array.from(new Array(24), (x,i) => 0);
			  }		
			  
			  for (i = 0; i < mCtrl.schedulePick.length; i++) {
				  metrics[Number(mCtrl.schedulePick[i].hour)][Number(mCtrl.schedulePick[i].hour)] = Number(mCtrl.schedulePick[i].count);
				
				  metrics[Number(mCtrl.schedulePick[i].hour)][(Number(mCtrl.schedulePick[i].hour) + 1) % 24] = Number(mCtrl.schedulePick[i].count);		  
				  
			  }	
				new Chart(document.getElementById("chartjs-3"), {
								"type": "radar",
								"data": {
									"labels": ["00", "01", "02", "03", "04", "05", "06",
										"07", "08", "09", "10", "11", "12",
										"13", "14", "15", "16", "17", "18",
										"19", "20", "21", "22", "23"],
									"datasets": [{
											"label": "00",
											"data": metrics[0],
											"fill": true,
											"backgroundColor": "rgba(255, 99, 132, 0.2)",
											"borderColor": "rgb(255, 99, 132)",
											"pointBackgroundColor": "rgb(255, 99, 132)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(255, 99, 132)"
										}, {
											"label": "01",
											"data": metrics[1],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "02",
											"data": metrics[2],
											"fill": true,
											"backgroundColor": "rgba(255, 255, 153, 0.2)",
											"borderColor": "rgb(255, 255, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "03",
											"data": metrics[3],
											"fill": true,
											"backgroundColor": "rgba(0, 204, 153, 0.2)",
											"borderColor": "rgb(0, 204, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "04",
											"data": metrics[4],
											"fill": true,
											"backgroundColor": "rgba(153, 0, 51, 0.2)",
											"borderColor": "rgb(153, 0, 51)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "05",
											"data": metrics[5],
											"fill": true,
											"backgroundColor": "rgba(255, 153, 0, 0.2)",
											"borderColor": "rgb(255, 153, 0)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "06",
											"data": metrics[6],
											"fill": true,
											"backgroundColor": "rgba(0, 102, 0, 0.2)",
											"borderColor": "rgb(0, 102, 0)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "07",
											"data": metrics[7],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "08",
											"data": metrics[8],
											"fill": true,
											"backgroundColor": "rgba(0, 255, 0, 0.2)",
											"borderColor": "rgb(0, 255, 0)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "rgb(0, 255, 0)",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "09",
											"data": metrics[9],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "10",
											"data": metrics[10],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "11",
											"data": metrics[11],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "12",
											"data": metrics[12],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "13",
											"data": metrics[13],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "14",
											"data": metrics[14],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "15",
											"data": metrics[15],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "16",
											"data": metrics[16],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "17",
											"data": metrics[17],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "18",
											"data": metrics[18],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "19",
											"data": metrics[19],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "20",
											"data": metrics[20],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "21",
											"data": metrics[21],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "22",
											"data": metrics[22],
											"fill": true,
											"backgroundColor": "rgba(54, 162, 235, 0.2)",
											"borderColor": "rgb(54, 162, 235)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}, {
											"label": "23",
											"data": metrics[23],
											"fill": true,
											"backgroundColor": "rgba(0, 153, 153, 0.2)",
											"borderColor": "rgb(0, 153, 153)",
											"pointBackgroundColor": "rgb(54, 162, 235)",
											"pointBorderColor": "#fff",
											"pointHoverBackgroundColor": "#fff",
											"pointHoverBorderColor": "rgb(54, 162, 235)"
										}
									]
								},
								"options": {
									"elements": {
										"line": {
											"tension": 0,
											"borderWidth": 3
										}
									}
								}
							});		
							
							 Factory.getOccupancyRatio().success(function (data) {
								  mCtrl.occupancyRatio = (data.status) ? data.data : [];
								  console.log(mCtrl.occupancyRatio)
								  var lables = [];
								  var data = [];
								  var backgrounds = [];
								  var possibleBackgrounds = ["rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(255, 205, 86)", 
									"rgb(201, 203, 207)", "rgb(54, 162, 235)"];
								  for (i = 0; i < mCtrl.occupancyRatio.length; i++) {
									  lables[i] = mCtrl.occupancyRatio[i].branch_profession;
									  data[i] = mCtrl.occupancyRatio[i].round;
									  backgrounds[i] = possibleBackgrounds[i % 5];
								  }	
								  
								  new Chart(document.getElementById("chartjs-5"), {
									"type": "polarArea",
									"data": {
										"labels": lables,
										"datasets": [{
												"label": "My First Dataset",
												"data": data,
												"backgroundColor": backgrounds
											}
										]
									}
								});
						  });
					});
							
							
			  });
			}
			catch (e) {
			  console.log(e);
			}
        $rootScope.layout.loading = false;
      };
	  
	  mCtrl.fillStaffUpdateFileds = function (index) {
        mCtrl.staffs[index].newFirstName =  mCtrl.staffs[index].firstName;
		mCtrl.staffs[index].newLastName =  mCtrl.staffs[index].lastName;
		mCtrl.staffs[index].newPhoneNumber =  mCtrl.staffs[index].phoneNumber;
		mCtrl.staffs[index].newPersonalInformation =  mCtrl.staffs[index].personalInformation;
      };
	  
	  mCtrl.fillClientUpdateFileds = function (index) {
        mCtrl.clients[index].newFirstName =  mCtrl.clients[index].first_name;
		mCtrl.clients[index].newLastName =  mCtrl.clients[index].last_name;
		mCtrl.clients[index].newPhoneNumber =  mCtrl.clients[index].phone_number;
		mCtrl.clients[index].newAddress =  mCtrl.clients[index].address;
		mCtrl.clients[index].newEmail =  mCtrl.clients[index].email;
      };
	  
	  mCtrl.fillBranchUpdateFileds = function (index) {
        mCtrl.branchList[index].newBranchName =  mCtrl.branchList[index].branchName;	
      };
	  
      mCtrl.popBlocker = function (index) {
        mCtrl.editMode = true;
        mCtrl.currentUserIndex = index;
      };

      mCtrl.closeBlocker = function () {
        mCtrl.editMode = false;
        mCtrl.currentUserIndex = -1;
      };

      $document.ready(function () {
        //document ready functions
      });
    }
  ]);

  app.controller('HeaderCtrl', ['$rootScope', 'Factory',
    function ($rootScope, Factory) {
      $rootScope.menuOpen = false;
      var hCtrl = this;
      hCtrl.sideMenuToggle = function () {
        if ($('#sideBar').hasClass('toggled')) {
          $('#sideBar').removeClass('toggled');
          $('#mainTemplate .container').css('margin-left', 'auto');
          $rootScope.menuOpen = false;
        } else {
          $('#sideBar').addClass('toggled');
          $('#mainTemplate .container').css('margin-left', '300px');
          $rootScope.menuOpen = true;
        }
      };
	  
      hCtrl.toggleDrop = function (event) {
        var el = event.target;
        if (el.tagName == 'I') {
          el = $(el).parent().parent();
		}
        var dropMenu = $(el).parent().find('ul');
        $(dropMenu).toggleClass('hide');
      };

      hCtrl.collapseMenu = function () {
        $('.menu-trigger').removeClass('open');
        $('.sub-menu').each(function () {
          $(this).removeClass('active');
          $(this).find('ul').addClass('hide');
        })
      };

      hCtrl.logout = function () {
        $rootScope.userId = -1;
        $rootScope.user = {};
        $rootScope.loginData = {};
        localStorage.removeItem('userId');
		Factory.logout();
      };
    }])
})(app || {});