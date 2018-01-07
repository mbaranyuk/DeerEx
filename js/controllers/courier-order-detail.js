angular.module('DeerEx')

.controller('CourierOrderDetailCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Api', '$ionicPopup', '$ionicLoading',
  function($scope, $state, $stateParams, $rootScope, Api, $ionicPopup, $ionicLoading) {
  
  var popup = undefined;

  $scope.order = undefined;
  $scope.delivery = {};

  $scope.$on('$ionicView.enter', function(e) {

    Api.q('orderDetails', {id: $stateParams.id, isCourier: true}).then(function(res){
      if (res.data) {
        $scope.order = res.data.order;

        $scope.delivery.icon = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
        if ($rootScope.myLocation)
          $scope.delivery.location = $rootScope.myLocation;
        else
          $scope.delivery.location = undefined;
      }
    }, function(){});

  });

  $scope.back = function() {
    $state.go($rootScope.previous.state);
  };
  
  $scope.declineOrder = function() {
    popup = $ionicPopup.show({
      templateUrl: 'templates/_confirm.html',
      scope: $scope
    });
  };

  $scope.confirm = function() {
    popup.close();

    Api.q('declineOrder', {id: $stateParams.id}).then(function(res){ //confirm delete
      $state.go('app.courier-orders');
    }, function(err) {});
  };

  $scope.cancel = function() { //cancel delete
    popup.close();
  };

  $scope.acceptOrder = function() {
    Api.q('acceptOrder', {id: $stateParams.id, device: $rootScope.me.device}).then(function(res){ 
      if (res) {
        $scope.order.status = 1;

        $ionicLoading.show({
          template: 'Order was accepted successfully',
          duration: 2500
        });
      }
    }, function(err) {});
  };

  $scope.doneOrder = function() {
    Api.q('doneOrder', {id: $stateParams.id}).then(function(res){ //confirm delete
      $scope.order.status = 2;

      $state.go('finish', {user: {name: $scope.order.user.name, phone: $scope.order.user.phone}});
    }, function(err) {});
  };

}]);
