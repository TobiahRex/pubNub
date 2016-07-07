'use strict';

angular.module('fullStackTemplate')
.config(function($stateProvider, $urlRouterProvider, toastrConfig, $authProvider){
  $authProvider.loginUrl = '/api/users/login';
  $authProvider.signupUrl = '/api/users/register';

  $authProvider.github({
    clientId : ''
  });

  $authProvider.facebook({
    clientId  : '1563271557312110',
    url       : '/api/oauth/facebook'
  });

  $stateProvider
  .state('splash', {
    url             :    '/',
    templateUrl     :    'html/splash.html',
    controller      :    'splashController'
  })
  .state('home', {
    url             :    '/home',
    templateUrl     :    'html/home.html',
    controller      :    'homeController'
  })
  .state('register', {
    url             :    '/register',
    templateUrl     :    'html/sign_in/register.html',
    controller      :    'registerController'
  })
  .state('verify', {
    url             :    '/verify',
    templateUrl     :    'html/sign_in/verify.html'
  })
  .state('verified', {
    url             :    '/verified',
    templateUrl     :    'html/sign_in/verified.html'
  })
  .state('unverified', {
    url             :    '/unverified',
    templateUrl     :    'html/sign_in/unverified.html'
  })
  .state('login', {
    url             :    '/login',
    templateUrl     :    'html/sign_in/login.html',
    controller      :    'loginController'
  })
  .state('logout', {
    url             :    '/logout',
    templateUrl     :    '/html/sign_in/logout.html',
    controller      :    'logoutController'
  })
  .state('forgot', {
    url             :    '/forgot',
    templateUrl     :    'html/sign_in/forgot.html',
    controller      :    'forgotController'
  })
  .state('profile', {
    url             :     '/profile',
    templateUrl     :     'html/profile.html',
    controller      :     'profileController',
    resolve         :     {
      dbProfile   :     function(Auth, $q, $state){
        return Auth.getProfile()
        .catch(err=>{
          console.log('err: ', err);
          $state.go('login');
          return $q.reject();
        });
      },
      dbUsers       :     function(Auth, $q){
        return Auth.getUsers()
        .then(res=> $q.resolve(res.data))
        .catch(err=> $q.reject(err))
      };
    }
  });
  $urlRouterProvider.otherwise('/');

  angular.extend(toastrConfig, {
    allowHtml: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    extendedTimeOut: 5000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    messageClass: 'toast-message',
    onHidden: null,  // cb()'s
    onShown: null,   //
    onTap: null,     //
    progressBar: false,
    tapToDismiss: true,
    templates: {
      toast: 'directives/toast/toast.html',
      progressbar: 'directives/progressbar/progressbar.html'
    },
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  });
  // Detailed Info @ https://github.com/Foxandxss/angular-toastr
});


// angular.module('fullStackTemplate')               // this is the alternative way of configuring oAuth without satellizer. (SEUDO CODE)
// .factory('httpInterceptor', function($q, Auth){
//   return {
//     request : function(config){
//       return Auth.getToken()
//       .then(token=>{
//         config.headers.Authorization = `Bearer ${jwtToken}`;
//         return $q.resolve(config); // pass on the promise to "config"
//       })
//     }
//   }
// })
