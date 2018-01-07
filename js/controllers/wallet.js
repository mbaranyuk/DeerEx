angular.module('DeerEx')

.controller('WalletCtrl', ['$scope', 'Api', '$ionicPopup', function($scope, Api, $ionicPopup) {
	$scope.total = 0;
	var template = ['<div class="card">',
	'<ul class="list" style="text-align: center;">',
	    '<li class="item" ng-click="getIncome(\'day\')">Dayly</li>',
	    '<li class="item" ng-click="getIncome(\'month\')">Monthly</li>',
	    '<li class="item" ng-click="getIncome(\'year\')">By year</li>',
	'</ul>',
'</div>'].join('');

	var filterPopup = undefined;

	$scope.getIncome = function(filter) {
		if (filterPopup)
			filterPopup.close();

		Api.q('getIncome', {filter: filter}).then(function(res){
			if (res && res.data) {
				$scope.income = res.data.income;

				var t = 0;
				for (var i = 0; i < $scope.income.length; i++) {
					t += parseFloat($scope.income[i].sum);
				}
				$scope.total = t;
			}
		}, function(err){});

	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.getIncome('day');
	});

	$scope.openFilterPopup = function() {
	    filterPopup = $ionicPopup.show({
	      template: template,
	      scope: $scope
	    });
	};

  
}]);
