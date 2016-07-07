'use strict';

angular.module('fullStackTemplate')
.controller('deleteAlbumModalController', function ($scope, $uibModalInstance, deleteAlbum) {
  console.log('deleteAlbumModalController');

  $scope.album = deleteAlbum.album;


  $scope.deleteAlbum = () => {
    let deleteAlbum = $scope.album
    $uibModalInstance.close(deleteAlbum._id);
  };
  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
});
