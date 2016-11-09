angular.module('starter', ['ionic','starter.controllers','firebase','ngCordova'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('Auth', function($firebaseAuth){
            
    var ref=new Firebase("https://geofamily.firebaseio");
    return $firebaseAuth(ref);
})

.config(function($stateProvider, $urlRouterProvider) { 
          
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
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
      }
    }
  })
  
  .state('app.addfamily', {
    url: '/addfamily',
    views: {
      'menuContent': {
        templateUrl: 'templates/addfamily.html',
          controller: 'AddCtrl'
      }
    }
  })

  .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
        
        }
      }
    })
  
  .state('app.family', {
      url: '/family',
      views: {
        'menuContent': {
          templateUrl: 'templates/family.html',
            controller: 'FamilyCtrl'
        }
      }
    })
  
  .state('app.login-into-menucontent', {
    url: "/login-into-menucontent",
    views: {
      'menuContent' :{
        templateUrl: "login.html",
        controller: 'AuthCtrl'
      }
    }
  })
  
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});






