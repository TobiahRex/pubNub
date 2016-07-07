'use strict';

angular.module('fullStackTemplate')
.controller('editTenantModalController', function ($scope, $uibModalInstance, Tenant, editTenant) {
  console.log('editTenantModalCtrl');
  $scope.tenant = editTenant.tenant;
  // console.log('$scope.tenant: ', $scope.tenant);
  $scope.submitChanges = () => {
    let editedTenant = $scope.tenant
    $uibModalInstance.close(editedTenant);
  };
  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
});
