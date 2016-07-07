'use strict';

angular.module('fullStackTemplate')
.controller('albumsController', function($scope, $state, Album, Photo, $uibModal, $log){
  console.log('albumsCtrl');



  let renderAlbums = () => {
    Album.getAlbums()
    .then(res=> {
      console.log(res.data);
      $scope.Albums = res.data;
    });
  }

  renderAlbums();

  let createAlbum = album => {
    Album.createAlbum(album)
    .then(res=>renderAlbums())
    .catch(err=>{
      $q.reject();
      console.log('album add did not work: ', err );
    });
  };


  let removeAlbum = album => {
    Album.deleteOne(album)
    .then(res=>renderAlbums())
    .catch(err=>{
      console.error(err);
      $state.go('albums');
    });
  };

  let insertPhoto = idObj => {
    Album.addPhoto(idObj)
    .then(()=> renderAlbums())
    .catch(err => console.error(err));
  };

  //////////////////////////////////////////////////////////////////////
  // Add photo modal

  $scope.addPhoto = album => {
    var modalInstance = $uibModal.open({
      keyboard: true,
      animation: true,
      templateUrl: '/uib/template/modal/insertPhotoModal.html',
      controller: 'insertPhotoModalController',
      size: 'lg',
      resolve : {
        dbPhotos : function(Photo, $q){
          return Photo.getPhotos()
          .catch(()=> $q.reject());
        },
        album
      };
    });

    modalInstance.result
    .then(idObj => insertPhoto(idObj),
    err => $log.info('Modal dismissed at: ' + Date(Date.now()));

  //////////////////////////////////////////////////////////////////////
  // Add Album
  $scope.addAlbum = () => {
    var modalInstance = $uibModal.open({
      keyboard: true,
      animation: true,
      templateUrl: '/uib/template/modal/addAlbumModal.html',
      controller: 'addAlbumModalController',
      size: 'lg',
    });

    modalInstance.result.then(function (album) {
      renderAlbums(album);
    }, function (something) {
      console.log('something: ', something);
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  ////////////////////////////////////////////////////////////////////////
  /// Edit Album
  $scope.editAlbum = album => {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/uib/template/modal/editAlbumModal.html',
      controller: 'editAlbumModalController',
      size: 'lg',
      resolve : { editAlbum : ()=> album }
    });
    modalInstance.result.then(function (editedAlbum) {
      console.log('editedAlbum: ', editedAlbum);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  ////////////////////////////////////////////////////////////////////////
  /// Delete Album
  $scope.deleteAlbum = album => {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/uib/template/modal/deleteAlbumModal.html',
      controller: 'deleteAlbumModalController',
      size: 'lg',
      resolve : { deleteAlbum : ()=> album }
    });
    modalInstance.result.then(function (albumId) {
      console.log(albumId);
      removeAlbum(albumId);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});
