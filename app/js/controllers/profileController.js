'use strict';

angular.module('fullStackTemplate')
.controller('profileController', function($state, $scope, Auth, dbProfile, dbUsers){
  console.log('profileCtrl');
  
  $scope.users = dbUsers;
  $scope.profile = dbProfile.data;

});
