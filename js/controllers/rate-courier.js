angular.module('DeerEx')

.controller('CourierRateCtrl', ['$scope', '$stateParams', 'Api', function($scope, $stateParams, Api) {
	$scope.raiting = 0;
	$scope.courier = {};

	$scope.$on('$ionicView.enter', function(e) {
	    $scope.courier = {
	    	name: $stateParams.data.courier.name
	    };
	});

	$scope.setRate = function(raiting) {
		$scope.raiting = raiting;
	};

	$scope.rateCourier = function() {
		Api.q('rateCourier', {id: $stateParams.data.courier.id, order: $stateParams.data.order, vote: $scope.raiting}).then(function(res) {
			if (res)
				$scope.isRated = true;
		});
	};
  
}]);
