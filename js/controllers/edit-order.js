angular.module('DeerEx')

.controller('EditOrderCtrl', ['$rootScope', '$scope', '$state', 'Api', '$filter', function($rootScope, $scope, $state, Api, $filter) {

	$scope.title = $filter('translate')('edit-order-title');	
	$scope.editing = true;

	var clearScope = function() {
	  	$rootScope.order = {};
	};	

	$scope.save = function() {
		var order = $rootScope.order;
		order.images = undefined;
		order.user = undefined;

		Api.q('updateOrder', {order: order}).then(function(res) {
			var id = $rootScope.order.id;
			clearScope();
			
			$state.go('order-detail', {id: id});

		}, function(err) {});
	};

	$scope.cancel = function() {
		var id = $rootScope.order.id;
		clearScope();

		$state.go('order-detail', {id: id});
	};
  
}]);
