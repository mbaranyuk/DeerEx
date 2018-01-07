angular.module('DeerEx')

.controller('CourierOrdersCtrl', ['$scope', '$ionicPopup', 'Api', '$ionicTabsDelegate', function($scope, $ionicPopup, Api, $ionicTabsDelegate) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.myOrders();
  });

  $scope.myOrders = function() {
    $ionicTabsDelegate.$getByHandle('myTabs').select(0);

    Api.q('getOrders', {isCourier: true}).then(function(res){

      $scope.$broadcast('scroll.refreshComplete');
      
      if (res.data.notActive) {
        filterPopup = $ionicPopup.show({
          templateUrl: 'templates/_courier-not-active.html'
        });

        return;
      }

      if (res && res.data.orders) {
        $scope.orders = res.data.orders;
        $scope.noOrders = false;
      } else {
        $scope.noOrders = true;
        $scope.orders = undefined;
      }

    }, function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.nearestOrders = function() {
    $ionicTabsDelegate.$getByHandle('myTabs').select(1);

    Api.q('nearestOrders').then(function(res){

      $scope.$broadcast('scroll.refreshComplete');

      if (res.data.notActive) {
        filterPopup = $ionicPopup.show({
          templateUrl: 'templates/_courier-not-active.html'
        });

        return;
      }
      
      if (res && res.data.orders) {
        $scope.orders = res.data.orders;
        $scope.noOrders = false;
      } else {
        $scope.noOrders = true;
        $scope.orders = undefined;
      }

    }, function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.doRefresh = function() {
    var tab = $ionicTabsDelegate.$getByHandle('myTabs').selectedIndex();

    if (tab == 0)
      $scope.myOrders();
    else
      $scope.nearestOrders();
  };

   $scope.openFilterPopup = function() {
    filterPopup = $ionicPopup.show({
      templateUrl: 'templates/_courier-filter.html',
      scope: $scope
    });
  };

  $scope.setFilter = function(filter) {
    $scope.filter = filter;

    filterPopup.close();
  };
  
}]);
