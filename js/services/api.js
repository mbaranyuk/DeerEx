angular.module('DeerEx')
.factory('Api', ['$http', '$rootScope', function($http, $rootScope) {

	return {
		q: function (action, data) {
			return $http.post($rootScope.apiBase + action, data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'} });
		}
	};
}]);