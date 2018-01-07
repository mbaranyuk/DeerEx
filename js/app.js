// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('DeerEx', ['ionic', 'pascalprecht.translate', 'contenteditable', 'focus-me', 'ngMap', 'angular.img'])

.run(['$ionicPlatform', '$rootScope', '$state', '$ionicLoading', 'Geolocation', function($ionicPlatform, $rootScope, $state, $ionicLoading, Geolocation) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
      StatusBar.backgroundColorByHexString("#d7874b");
    }

    window.FirebasePlugin.onNotificationOpen(function(notification) {
      if (!$rootScope.me.isCourier) {
        if (notification.tap)
          $state.go('order-detail', {id: notification.order});
        else if (window.location.href.indexOf('orders/'+notification.order) !== -1) {
          $ionicLoading.show({
            template: 'Orders status changed to '+notification.status,
            duration: 2500
          });

          $state.go('order-detail', {id: notification.order}, {reload: true});
        }
      } else if (notification.status == -1) {
         $ionicLoading.show({
            template: 'Orders status changed to '+notification.status,
            duration: 2500
          });

         if (window.location.href.indexOf('courier-orders/'+notification.order) !== -1)
          $state.go('app.courier-orders');
      }

      if (notification.doRate && notification.tap)
        $state.go('app.rate', {data: notification});
    }, function(error) {
        console.error(error);
    });

    document.addEventListener("backbutton", function(e){
       if($state.includes('app.auth')){
           e.preventDefault();
           navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory()
       }
    }, false);
  });


  $rootScope.order = {};

  $rootScope.apiBase = 'http://deerex.hol.es/api/';

  try {
    $rootScope.me = JSON.parse(localStorage.getItem('DMe'));
  } catch(e) {
    $rootScope.me = undefined;
  }

  if ($rootScope.me === null) 
    $rootScope.me = undefined;
  else {

    if ($rootScope.me.isCourier)
      Geolocation.init();
  }


  //save prev state to go back later
  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
      $rootScope.previous = {state: from, params: fromParams};
  });


  //show spinner when call api
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });

  var escapeStates = ['app.auth', 'app.auth-confirm', 'splash'];
  $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

      if( (escapeStates.indexOf(to.name) < 0) && !$rootScope.me ){

        $state.go('app.auth');
        ev.preventDefault();
      } else 
      	return;

  });

}])

.config(['$translateProvider', function ($translateProvider) {

  // add translation tables
  $translateProvider.useStaticFilesLoader({
    prefix: 'locales/locale-',
    suffix: '.json'
});
  $translateProvider.determinePreferredLanguage(function () {
    var preferredLangKey = localStorage.getItem('DeerLang');
    // some custom logic's going on in here
    return preferredLangKey === null ? 'en' : preferredLangKey;
  });
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useStorage('customStorage');
}])

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  .state('splash', {
  	url: '/splash',
    templateUrl: 'templates/splash.html',
    controller: 'AppCtrl'
  })

  .state('app', {
    abstract: true,
    template: '<ion-nav-view></ion-nav-view>',
    controller: 'AppCtrl'
  })

  .state('app.auth', {
    url: '/auth',
    templateUrl: 'templates/auth-form.html'
  })

  .state('app.offline', {
    url: '/isOffline',
    templateUrl: 'templates/_isOffline.html'
  })

  .state('app.auth-confirm', {
    url: '/auth-confirm',
    templateUrl: 'templates/auth-confirm.html'
  })

  .state('app.register', {
    url: '/register',
    templateUrl: 'templates/register.html'
  })

  .state('app.menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html'
  })

  .state('app.orders', {
    url: '/orders',
    templateUrl: 'templates/order-grid.html',
    controller: 'OrdersCtrl'
  })

  .state('size', {
    url: '/size',
    templateUrl: 'templates/size.html',
    controller: 'NewOrderCtrl'
  })

  .state('from', {
    url: '/from-address',
    templateUrl: 'templates/address-form.html',
    controller: 'AddressCtrl'
  })

  .state('to', {
    url: '/to-address',
    templateUrl: 'templates/address-form.html',
    controller: 'AddressCtrl'
  })

  .state('comment', {
    url: '/add-comment',
    templateUrl: 'templates/comment.html',
    controller: 'NewOrderCtrl'
  })

  .state('order-detail', {
    url: '/orders/:id',
    templateUrl: 'templates/order-detail.html',
    controller: 'OrderDetailCtrl'
  })

  .state('edit-order', {
    url: '/edit-order',
    templateUrl: 'templates/new-order.html',
    controller: 'EditOrderCtrl'
  })

  .state('new-order', {
    url: '/new-order',
    templateUrl: 'templates/new-order.html',
    controller: 'NewOrderCtrl'
  })

  .state('app.courier-orders', {
    url: '/courier-orders',
    templateUrl: 'templates/courier-orders.html',
    controller: 'CourierOrdersCtrl'
  })

  .state('courier-order-detail', {
    url: '/courier-orders/:id',
    templateUrl: 'templates/order-detail.html',
    controller: 'CourierOrderDetailCtrl'
  })

  .state('app.rate', {
    templateUrl: 'templates/rate.html',
    controller: 'CourierRateCtrl',
    params: {
      data: null
    }
  })

  .state('app.wallet', {
    url: '/wallet',
    templateUrl: 'templates/wallet.html',
    controller: 'WalletCtrl'
  })

  .state('app.leaderboard', {
    url: '/leaderboard',
    templateUrl: 'templates/leaderboard.html',
    controller: 'LeaderboardCtrl'
  })

  .state('finish', {
    templateUrl: 'templates/finish.html',
    controller: 'FinishCtrl',
    params: {
      user: null
    }
  });

  /*.state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })*/

  $httpProvider.interceptors.push('APIInterceptor');
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/splash');
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        var $rootScope = $injector.get('$rootScope');

        if ($rootScope.me) {
          if ($rootScope.me.isCourier)
            $state.go('app.courier-orders');
          else
            $state.go('app.orders');
        } else 
          $state.go('splash');
        
    });
}]);
