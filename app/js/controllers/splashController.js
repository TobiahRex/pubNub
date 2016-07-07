'use strict';

angular.module('fullStackTemplate')
.controller('splashController', function($scope, $state){
  console.log('splashCtrl');

  $scope.goToHome = () => {
    $state.go('home');
  };


});
