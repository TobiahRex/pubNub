'use strict';

angular.module('fullStackTemplate')
.controller('logoutController', function($scope, $state, Auth, toastr, $auth){
  console.log('logoutCtrl');

  Auth.logoutUser()
  .then(res=> {
    $auth.logout();
    toastr.info('You have been successfully logged out.', 'Logged Out', {iconClass : 'toast-info-toby'})
    $scope.$emit('loggedOut');
  });
});
