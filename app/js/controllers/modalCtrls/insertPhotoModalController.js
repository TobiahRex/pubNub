'use strict';

angular.module('fullStackTemplate')
.controller('insertPhotoModalController', function ($scope, $uibModalInstance, dbPhotos, album) {
  console.log('insertPhotoModalController');

  $scope.Photos = dbPhotos.data;
  let thisAlbum = album.album._id;

  $scope.insertPhoto = photo => {
    let addPhoto = angular.copy(photo);

    let idObj = {
      albumId : thisAlbum,
      photoId : addPhoto.photo._id
    }
    $uibModalInstance.close(idObj);
  };

  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
});
