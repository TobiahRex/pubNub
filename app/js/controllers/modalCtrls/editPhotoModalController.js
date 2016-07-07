'use strict';

angular.module('fullStackTemplate')
.controller('editPhotoModalController', function ($scope, $uibModalInstance, Photo, editPhoto) {
  console.log('editPhotoModalCtrl');

  $scope.urlCopy = angular.copy(editPhoto.photo.url);

  $scope.submitChanges = () => {
    let editedPhoto = $scope.photo;

    $uibModalInstance.close(editedPhoto);
  };
  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
});
