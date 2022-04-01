var app = (function () {

  // create app module
  var app = angular.module('app', ['ngRoute', 'ui.filters']);

  // app configuration
  app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    // intercept POST requests, convert to standard form encoding
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
      var key, result = [];
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
      }
      return result.join("&");
    });

    // set routing
    $routeProvider
      .when('/', {
        templateUrl: './templates/main.html'
      })
      .when('/home', {
        templateUrl: './templates/main.html'
      })
      .when('/login', {
        templateUrl: './templates/login.html'
      })
	  .when('/Branches/add', {
        templateUrl: './templates/Branches/add.html',
		resolve: {
			initData: function ($q, $http, $route) {
				var defer = $q.defer(); // create a promise object
				$http({ // ajax http call
				  method: 'POST',
				  url: serverUrl + 'area/get_areas',
				  cache: false
				}).success(function (data, status) {
					if (status == 200) {
					  defer.resolve(data); // resolve with data
					}
				}).error(function (data, status, headers, config) {
                console.log(data);
				});
				return defer.promise; // return promise object
			}
		}
      })
	  .when('/Branches/list', {
        templateUrl: './templates/Branches/list.html',
		resolve: {
			initData: function ($q, $http, $route) {
				var defer = $q.defer(); // create a promise object
				$http({ // ajax http call
				  method: 'POST',
				  url: serverUrl + 'branches/get_branches',
				  cache: false
				}).success(function (data, status) {
					if (status == 200) {
					  defer.resolve(data); // resolve with data
					}
				}).error(function (data, status, headers, config) {
                console.log(data);
				});
				return defer.promise; // return promise object
			}
		}
      })
	  .when('/Clients/add', {
        templateUrl: './templates/Clients/add.html'
      })
	  .when('/Clients/list', {
        templateUrl: './templates/Clients/list.html'
      })
	  .when('/Clients/deleted_list', {
        templateUrl: './templates/Clients/deleted_list.html'
      })
	  .when('/Staff/add', {
        templateUrl: './templates/Staff/add.html'
      })
	  .when('/Staff/list', {
        templateUrl: './templates/Staff/list.html'
      })
	  .when('/Appointments/list', {
        templateUrl: './templates/Appointments/list.html'
      })
	  .when('/Appointments/list_prev', {
        templateUrl: './templates/Appointments/list_prev.html'
      })
	  .when('/Appointments/schedule', {
        templateUrl: './templates/Appointments/schedule.html'
      })
	  .when('/analytics', {
        templateUrl: './templates/Analytics/analytics.html'
      })
      .otherwise({
        templateUrl: './templates/404.html'
      });
  }])
    .run(function($location,$rootScope,Factory,$timeout){
      $rootScope.layout = {};
      $rootScope.layout.loading = false;
      $rootScope.firstLoad = true;

      $rootScope.$on('$routeChangeSuccess', function() {

        //hide loading gif
        $timeout(function(){
          $rootScope.layout.loading = false;
        }, 500);

      });

      $rootScope.$on('$routeChangeError', function() {
        $rootScope.layout.loading = false;
      });

      $rootScope.$on( "$routeChangeStart", function(event, next, current) {

        $rootScope.formData = {};

        //show loading gif
        $timeout(function(){
          $rootScope.layout.loading = true;
        });

        if ($rootScope.firstLoad){
          $rootScope.firstLoad = false;
        }
        else {
          $rootScope.$$childHead.hCtrl.sideMenuToggle();
          $rootScope.$$childHead.hCtrl.collapseMenu();
        }

        if (!$rootScope.userId || $rootScope.userId === -1) {
          if (next.templateUrl == "/templates/users.html") { }
          else {
             $rootScope.userId = -1;
             $location.path('/login');
          }
        }
      });
    });

  return app;
})();
