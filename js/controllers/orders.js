angular.module('DeerEx')

.controller('OrdersCtrl', ['$scope', '$ionicPopup', 'Api', function($scope, $ionicPopup, Api) {
  $scope.orders = [];
  $scope.filter = undefined;
  var filterPopup = undefined;
  
  var getOrders = function() {
     Api.q('getOrders').then(function(res){
      if (res && res.data) {
        $scope.noOrders = (res.data && res.data.orders) ? false : true;
        $scope.orders = res.data.orders;

      } else {
        $scope.noOrders = true;
        $scope.orders = undefined;
      }

      $scope.$broadcast('scroll.refreshComplete');
    }, function(err){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.$on('$ionicView.enter', function(e) {
    getOrders();
  });

  $scope.openFilterPopup = function() {
    filterPopup = $ionicPopup.show({
      templateUrl: 'templates/_filter.html',
      scope: $scope
    });
  };

  $scope.setFilter = function(filter) {
    $scope.filter = filter;

    filterPopup.close();
  };

  $scope.doRefresh = function() {
    getOrders();
  };
  
}]);
