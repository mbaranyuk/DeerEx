angular.module('DeerEx')

.controller('LeaderboardCtrl', ['$scope', 'Api', function($scope, Api) {
	$scope.couriers = [];

	$scope.$on('$ionicView.enter', function(e) {
		Api.q('getLeaderboard').then(function(res){
			if (res && res.data) {
				$scope.couriers = res.data.couriers;
			}
		}, function(err){});
	});

  
}]);
