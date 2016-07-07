'use strict';

var app = angular.module('fullStackTemplate');

app.factory('socket', function (socketFactory) {
  var service = socketFactory();
  service.forward('error');
  return service;
});
