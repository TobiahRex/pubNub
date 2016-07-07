'use strict';

angular.module('fullStackTemplate')
.controller('homeController', function($scope, $state, $uibModal, toastr){
  console.log('homeCtrl');

  $scope.showSuccessMsg = () => toastr.success('Your information has been saved successfully!');
  $scope.showInfoMsg = () => toastr.info("You've got a new email!", 'Information');
  $scope.showErrorMsg = () => toastr.error("Your information hasn't been saved!", 'Error');
  $scope.showWarningMsg = () => toastr.warning('Your computer is about to explode!', 'Warning');

});
