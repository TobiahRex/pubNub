'use strict';

angular.module('fullStackTemplate')
.service('Auth', function($http){

  this.getUsers = _ => $http.get('/api/users');

  this.loginUser = userObj => $http.post('/api/users/login', userObj);

  this.logoutUser = _ => $http.post('/api/users/logout');

  this.registerUser = userObj => $http.post('/api/users/register', userObj);

  this.getProfile = _ => $http.get('/api/users/profile');

  this.toggleAdmin = id => $http.put(`/api/users/${id}/toggle_admin`);

});
