'use strict';

angular.module('fullStackTemplate')
.controller('newItemController', function($scope, $state){

// TODO : Create Items Service

    function renderNew(){
      Items.getAll()
      .then(res => {
        $scope.items = res.data;
      })
      .catch(err => {
        $scope.items = err;
      })
    };

    $scope.$on('getNewItems', function(){renderNew()});
});
