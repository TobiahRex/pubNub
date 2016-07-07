'use strict';

angular.module('fullStackTemplate')
.service('Profile', function($http){

  this.getProfile = _ => $http.get('/api/users/profile');

});
