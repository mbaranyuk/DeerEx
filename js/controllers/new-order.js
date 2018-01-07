angular.module('DeerEx')

.controller('NewOrderCtrl', ['$rootScope', '$scope', '$state', '$ionicLoading', 'Api', '$ionicPlatform', '$filter', '$ionicActionSheet',
	function($rootScope, $scope, $state, $ionicLoading, Api, $ionicPlatform, $filter, $ionicActionSheet) {

	$scope.title = $filter('translate')('new-order-title');	

	$scope.$on('$ionicView.enter', function(e) {
		if (!$rootScope.me.device) {
	    	window.FirebasePlugin.getToken(function(token) {
	            $rootScope.me.device = token;

	            localStorage.setItem('DMe', JSON.stringify($rootScope.me));
	        }, function(error) {
	            console.error(error);
	        }); 
	    }	
	});	

	var clearScope = function() {
		if (navigator.camera)
  			navigator.camera.cleanup();

	  	$rootScope.images = undefined;
	  	$rootScope.order = {};
	};		

  $scope.save = function() {

  	if (!$rootScope.order.from || !$rootScope.order.from || !$rootScope.order.size) {
  		$ionicLoading.show({
			template: 'You must fill at least from, to and size!',
			duration: 2500
	    });

	    return;
  	}

  	var i, oId, payLink;

  	var win = function (r) { 
        i++;

        if (i !== $rootScope.images.length)   
        	uploadImage($rootScope.images[i]);
        else {
        	showPay(payLink, oId);
        }
    };

    var uploadImage = function(fileURI) {
    	$ionicPlatform.ready(function() {

	    	var options = new FileUploadOptions();
		    options.fileKey = "upfile";
		    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
		    options.mimeType = "image/jpeg";
		    options.chunkedMode = false;
		    options.httpMethod = 'POST';
		    options.headers = {'X-Order': oId, 'X-Authentication': $rootScope.me.token};
		    var ft = new FileTransfer();
		    ft.upload(fileURI, encodeURI($rootScope.apiBase + 'uploadImage'), win, win, options);
		});
    };


    $rootScope.order.device = $rootScope.me.device;
  	Api.q('newOrder', {order: $rootScope.order}).then(function(res){
  		if (res && res.data) {
			oId = res.data.order;
			payLink = res.data.payLink;

			if ($rootScope.images && $rootScope.images.length > 0) {
			  i = 0;
			  uploadImage($rootScope.images[i]);
			} else 
				showPay(payLink);
		}
    }, function(err) {});

  };

  var showPay = function(payLink) {
  	var backdrop = angular.element(document.getElementsByClassName('backdrop')[0]);
  	backdrop.addClass('active visible');

  	var oab = new OverAppBrowser(payLink, 10, 16, window.innerWidth-20, window.innerHeight-32, true);
  	$rootScope.$broadcast('loading:show');

  	oab.addEventListener('loadstop', function(event){
  		$rootScope.$broadcast('loading:hide');
  	});

  	oab.addEventListener('loadstart', function(event){

  		if(event.url.indexOf('paymentResponse') > -1) {
  			clearScope();
  			backdrop.removeClass('active visible');
  			oab.close();
  			$state.go('finish');
  		}

	});
  };

  $scope.cancel = function() {
  	clearScope();

  	$state.go('app.orders');
  };

  $scope.deleteImg = function(index) {
  	$rootScope.images.splice(index, 1);
  };

  $scope.attachImg = function() {
  	var actionOpt = {
  		titleText: $filter('translate')('add-img-title'),
  		buttons: [
	       { text: '<i class="icon ion-camera balanced"></i> ' + $filter('translate')('camera-btn') },
	       { text: '<i class="icon ion-image balanced"></i> ' + $filter('translate')('gallery-btn') }
	    ],
	    cancelText: $filter('translate')('decline-btn'),
     	cancel: function() {
          return true;
        },
	    buttonClicked: function(index) {
	       addNewImg(index);
	       return true;
	    }
  	};

  	$ionicActionSheet.show(actionOpt);
  };

  var addNewImg = function(src) {
	if ($rootScope.images && $rootScope.images.length == 5) {
		return;
	}

	$ionicLoading.show({
		template: '<ion-spinner></ion-spinner>'
    });

	$ionicPlatform.ready(function() {

		var options = {
		  quality: 50,
		  destinationType: Camera.DestinationType.FILE_URI,
		  sourceType: src == 0 ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
		  encodingType: Camera.EncodingType.JPEG,
		  mediaType: Camera.MediaType.PICTURE,
		  targetWidth: 1000,
		  targetHeight: 1000,
		  correctOrientation: true
		};

		navigator.camera.getPicture(function cameraSuccess(imageUri) {   
			$ionicLoading.hide();

			$rootScope.$apply(function(){
				if (!$rootScope.images)
				$rootScope.images = [];

				$rootScope.images.push(imageUri);	
			});
			

		}, function cameraError(error) {
		    console.debug("Unable to obtain picture: " + error, "app");
		    $ionicLoading.hide();

		}, options);
	});
  };

  $scope.setSize = function(size) {
  	$rootScope.order.size = size;

    $state.go($rootScope.previous.state);
  };

  $scope.addComment = function(comment) {
  	$rootScope.order.comment = comment;

  	$state.go($rootScope.previous.state);
  };

  
}]);
