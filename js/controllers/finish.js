angular.module('DeerEx')

.controller('FinishCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.user = undefined;

	$scope.$on('$ionicView.enter', function(e) {
		if ($stateParams.user)
		    $scope.user = {
		    	name: $stateParams.user.name,
		    	phone: $stateParams.user.phone
		    };
	});

	$scope.share = function() {
		var options = {
		  //message: 'Fastest Way to Make Delivery - Doday',  not supported on some apps (Facebook, Instagram)
		  subject: 'DODAY App', // fi. for email
		  url: 'http://doday.com'
		  //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		}

		window.plugins.socialsharing.shareWithOptions(options);
	};

}]);
