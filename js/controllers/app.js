angular.module('DeerEx')

.controller('AppCtrl', ['$scope', '$state', '$rootScope', 'Api', 'Geolocation', '$ionicPopup', '$translate',
    function($scope, $state, $rootScope, Api, Geolocation, $ionicPopup, $translate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var loadGoogleMaps = function(apiKey){
  
    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";
 
    //Note the callback function in the URL is the one we created above
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey 
    + '&sensor=true&callback=mapInit';
        }
        else {
    script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
        }
 
    document.body.appendChild(script);
 
  };

  var authRedirect = function() {
    if ($rootScope.Role) 
      $rootScope.me.isCourier = false;
    else 
      $rootScope.me.isCourier = true;

    $rootScope.Role = undefined;

    $scope.toggleMode();
  };


  $scope.openMenu = function() {
    $state.go('app.menu');
  };

  $scope.closeMenu = function() {
    $state.go($rootScope.previous.state);
  };

  //for back from offline state
  $scope.goBack = function() {
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    }

    $state.go($rootScope.previous.state, $rootScope.previous.params);
  };

  $scope.setRole = function(role) {
    $rootScope.Role = role; 
  };

  $scope.doAuth = function(phone) {
    Api.q('auth', {phone: phone}).then(function(){
      $rootScope.authPhone = phone;
      $state.go('app.auth-confirm');
    },function(err){});
  };

  $scope.doLogout = function() {
    $rootScope.me = undefined;

    localStorage.removeItem('DMe');

    $state.go('app.auth');
  };

  $scope.resendSMS = function() {
    Api.q('auth', {phone: $rootScope.authPhone});
  };

  $scope.doConfirm = function(code) {
    Api.q('verify', {code: code, phone: $rootScope.authPhone}).then(function(res){
      $rootScope.authPhone = undefined;

      $rootScope.me = res.data;

      if (!$rootScope.me.device)
        window.FirebasePlugin.getToken(function(token) {
            $rootScope.me.device = token;
        }, function(error) {
            console.error(error);
        }); 
          
      localStorage.setItem('DMe', JSON.stringify($rootScope.me));

      if (res.data.nick == null)
        $state.go('app.register');
      else 
        authRedirect();
    },function(err){
      $scope.err = true;
    });
  };

  $scope.register = function(name, eMail) {
    Api.q('register', {name: name, mail: eMail}).then(function(){
      $rootScope.me.nick = name;

      localStorage.setItem('DMe', JSON.stringify($rootScope.me));
      
      authRedirect();
    },function(err){});
  };

  $scope.setphone = function(phone) {
    Api.q('setPhone', {phone: phone}).then(function(){
      $rootScope.me.phone = phone;

      localStorage.setItem('DMe', JSON.stringify($rootScope.me));
      
      newPhone = undefined;
    },function(err){});
  };

  $scope.changeLanguage = function() {
    
    var langPopup = $ionicPopup.show({
      templateUrl: 'templates/_language.html',
      scope: $scope
    });
  };

  $scope.setLang = function(lang) {
    $translate.use(lang);

    langPopup.close();
  };

  $scope.toggleMode = function(event) {
    if (!$rootScope.me) {
      $state.go('app.auth');
      return;
    }
    $rootScope.$broadcast('loading:show');

    if ($rootScope.me.isCourier) {
      $rootScope.me.isCourier = false;
      localStorage.setItem('DMe', JSON.stringify($rootScope.me));

      Geolocation.stop();
      
      $rootScope.$broadcast('loading:hide');
      $state.go('app.orders');
    } else {
      $rootScope.me.isCourier = true;
      localStorage.setItem('DMe', JSON.stringify($rootScope.me));

      Geolocation.init();

      $rootScope.$broadcast('loading:hide');
      $state.go('app.courier-orders');
    }
  };
  
}]);
