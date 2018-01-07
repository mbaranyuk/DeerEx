angular.module('DeerEx')
.factory('Geolocation', ['$rootScope', 'Api', '$ionicPlatform', function($rootScope, Api, $ionicPlatform) {
	var callbackFn = function(location) {
        console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
  
        Api.q('setCourierLocation', {location: location});
        $rootScope.myLocation = location;
        
        backgroundGeolocation.finish();
    };

    var failureFn = function(error) {
        console.log('BackgroundGeolocation error');
    };

	return {
		init: function () {
			$ionicPlatform.ready(function() {

			    backgroundGeolocation.configure(callbackFn, failureFn, {
			        desiredAccuracy: 10,
			        stationaryRadius: 20,
			        distanceFilter: 20,
			        maxLocations: 1,
			        interval: 20000
			    });

			    backgroundGeolocation.isLocationEnabled(function (enabled) {
			      if (enabled) {
			        backgroundGeolocation.start(
			          function () {
			            // service started successfully
			            // you should adjust your app UI for example change switch element to indicate
			            // that service is running
			          },
			          function (error) {
			            // Tracking has not started because of error
			            // you should adjust your app UI for example change switch element to indicate
			            // that service is not running
			            if (error.code === 2) {
			              if (window.confirm('Not authorized for location updates. Would you like to open app settings?')) {
			                backgroundGeolocation.showAppSettings();
			              }
			            } else {
			              window.alert('Start failed: ' + error.message);  
			            }
			          }
			        );
			      } else {
			        // Location services are disabled
			        if (window.confirm('Geolocation is disabled. Would you like to open location settings?')) {
			          backgroundGeolocation.showLocationSettings();
			        }
			      }
			    });
			});
		},

		stop: function() {
			$ionicPlatform.ready(function() {
				backgroundGeolocation.stop();
			});
		}
	};
}]);