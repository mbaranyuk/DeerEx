angular.module('DeerEx')

.controller('OrderDetailCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Api', '$ionicPopup', 
  function($scope, $state, $stateParams, $rootScope, Api, $ionicPopup) {
  
  var popup = undefined;
  var locationTimer = undefined;

  $scope.order = undefined;
  $scope.delivery = {};

  $scope.back = function() {
    $state.go($rootScope.previous.state);
  };

  var updateLocation = function() {
    Api.q('getCourierLocation', {id: $stateParams.id}).then(function(res) {
      if (res && res.data) {
        $scope.delivery.location = res.data.location;
      }
    }, function(err) {});
  };

  $scope.$on('$ionicView.enter', function(e) {

    Api.q('orderDetails', {id: $stateParams.id}).then(function(res){
      if (res && res.data) {
        $scope.order = res.data.order;

        $scope.delivery.icon = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';

        if ($scope.order.status === 1)
          locationTimer = setInterval(updateLocation, 20000); //20 sec
      }
    }, function(){});

  });

  $scope.$on('$ionicView.leave', function(e) {
    if (locationTimer)
      clearInterval(locationTimer);
  });
  
  $scope.deleteOrder = function() {
    popup = $ionicPopup.show({
      templateUrl: 'templates/_confirm.html',
      scope: $scope
    });
  };

  $scope.confirm = function() {
    popup.close();

    Api.q('deleteOrder', {id: $stateParams.id}).then(function(res){ //confirm delete
      $state.go('app.orders');
    }, function(err) {});
  };

  $scope.cancel = function() { //cancel delete
    popup.close();
  };

  $scope.editOrder = function() {
    $rootScope.order = $scope.order;

    $state.go('edit-order');
  };

}]);
