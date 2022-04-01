// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('takecareapp', ['ionic', 'takecareapp.controllers', 'takecareapp.factory', 'ui.filters'])

  .run(function ($ionicPlatform,$rootScope,$state,AppFactory) {
    $ionicPlatform.ready(function () {


      if ((!$rootScope.userId || $rootScope.userId === -1) && $state.$current !== 'app.login') {
        console.log('unknown user, referring...');
        $state.go('app.login');
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html'
          }
        },
        controller: 'AppCtrl'
      })
	  .state('app.newAppointment', {
        url: '/newAppointment',
        views: {
          'menuContent': {
            templateUrl: 'templates/newAppointment.html'
          }
        },
        controller: 'AppCtrl'
      })
	  .state('app.nextAppointments', {
        url: '/nextAppointments',
        views: {
          'menuContent': {
            templateUrl: 'templates/nextAppointments.html'
          }
        },
        controller: 'AppCtrl'
      })
	  .state('app.previousAppointments', {
        url: '/previousAppointments',
        views: {
          'menuContent': {
            templateUrl: 'templates/previousAppointments.html'
          }
        },
        controller: 'AppCtrl'
      })
	  .state('app.messagesArea', {
        url: '/messagesArea',
        views: {
          'menuContent': {
            templateUrl: 'templates/messagesArea.html'
          }
        },
        controller: 'AppCtrl'
      })
      .state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'templates/about.html'
          }
        },
        controller: 'AppCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/login');
  });
