angular.module('DeerEx')
.factory('APIInterceptor', ['$rootScope', '$injector', '$q', function($rootScope, $injector, $q) {
    return {
        'responseError': function(response) {
            $rootScope.$broadcast('loading:hide');

            if (response.status <= 0 && response.config.url.indexOf('setCourierLocation') === -1) {
                var state = $injector.get('$state');
                state.go('app.offline');

                return;
            }
            
            if (response.status === 401) {
                var authService = $injector.get('$state');
                authService.go('app.auth');
                
                return;
            }

            $q.reject(response);
        },

        'response': function(response) {
          // do something on success
            $rootScope.$broadcast('loading:hide');

            return response;
        },

        'request': function(config) {
            if (config.url.indexOf('setCourierLocation') === -1)
                $rootScope.$broadcast('loading:show');

            if ($rootScope.me)
                config.headers['X-Authentication'] = $rootScope.me.token;
            
            return config;
        }
    };
}]);