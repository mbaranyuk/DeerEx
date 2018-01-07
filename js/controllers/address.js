angular.module('DeerEx')

.controller('AddressCtrl', ['$scope', '$rootScope', '$state', '$timeout', function($scope, $rootScope, $state, $timeout) {
  $scope.locations = [];

  var geocoder = new google.maps.places.AutocompleteService();
  var searchEventTimeout = undefined;
  var searchInputElement = document.getElementById('q_input');

  $scope.selectLocation = function(location){
    var l = location.description.split(",").reverse().join(", ") + ' ';

    if ($scope.searchQuery === l){
        $scope.locations = [];

        if ($state.includes('from'))
            $rootScope.order.from = $scope.searchQuery;
        else if ($state.includes('to'))
            $rootScope.order.to = $scope.searchQuery;


        $state.go($rootScope.previous.state);
    }

    $scope.searchQuery = l;

    $timeout(function() {
      searchInputElement.focus();
    }, 50);

  };

  $scope.watchSearch = function(query) {

    if(!query) return;

    if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
    searchEventTimeout = $timeout(function() {

        //geocoder.geocode({address: query, region: 'pl'}, function(results, status) {
        geocoder.getPlacePredictions({input: query, country: 'pl'}, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $scope.$apply(function(){
                    $scope.locations = results;
                });
            } else {
                // @TODO: Figure out what to do when the geocoding fails
            }
        });
    }, 350); // we're throttling the input by 350ms to be nice to google's API
  };

  $scope.clearSearch = function() {
      $scope.searchQuery = '';
  };
  
}]);
