var app = angular.module('starter', ['ionic']);

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $stateProvider
        .state('tabs', {
            url: "/tab",
            templateUrl: "templates/tabs.html"
        })
        .state('tabs.index', {
            url: "/index",
            views: {
                'index-tab': {
                    templateUrl: "templates/index.html",
                    controller: 'indexCtrl'
                }
            }
        })
        .state('info/:id', {
            url: "/info/:id",
            templateUrl: "templates/info.html",
            controller: 'infoCtrl'
        })
        .state('tabs.find', {
            url: "/find",
            views: {
                'find-tab': {
                    templateUrl: "templates/find.html",
                    controller: 'findCtrl'
                }
            }
        })
        .state('tabs.about', {
            url: "/about",
            views: {
                'about-tab': {
                    templateUrl: "templates/about.html",
                    controller: 'aboutCtrl'
                }
            }
        });
    $urlRouterProvider.otherwise("/tab/index");
});


/*全局变量*/
app.value("global_config", {
    timeout:1000//http请求默认超时时间1秒
});

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.controller("indexCtrl", function ($scope,$http,$ionicLoading,global_config) {
    $scope.images = [];
    var params = {
        p:0
    };

    var indicator_ops = {
        show:function(){
            $ionicLoading.show({
                template: '拼命加载...',
                animation: 'fade-in',
                showBackdrop: true,
                duration: global_config.timeout
            }).then(function(){
                //console.log("The loading indicator is now displayed");
            });
        },
        hide:function(){
            $ionicLoading.hide().then(function(){
                //console.log("The loading indicator is now hidden");
            });
        }
    };

    $scope.doRefresh = function() {
        params.p = 0;
        params.p++;
        indicator_ops.show();
        $http.get( common_ops.buildUrl("/v1/emoticon/default/index",params),{ timeout:global_config.timeout } )
            .success(function( res ) {
                $scope.images = [];
                var data = res.data;
                for( var idx in data ){
                    $scope.images.push( data[idx] );
                }
            }).finally(function() {
                indicator_ops.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.domore = false;

    $scope.loadMore = function(){
        params.p++;
        indicator_ops.show();
        $http.get( common_ops.buildUrl("/v1/emoticon/default/index",params),{ timeout:global_config.timeout } )
            .success(function( res ) {
                var data = res.data;
                if( data.length == 0 ){
                    $scope.domore = true;
                    return;
                }

                for( var idx in data ){
                    $scope.images.push( data[idx] );
                }

            }).finally(function() {
                indicator_ops.hide();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };


});
app.controller("infoCtrl", function ($scope,$state, $ionicModal,$stateParams,$window,$http,$ionicLoading,global_config) {

    var params = {
        'id': $stateParams.id,
        'w': $window.innerWidth
    };

    var indicator_ops = {
        show:function(){
            $ionicLoading.show({
                template: '分享成功',
                animation: 'fade-in',
                showBackdrop: true,
                duration: global_config.timeout
            }).then(function(){
                //console.log("The loading indicator is now displayed");
            });
        },
        hide:function(){
            $ionicLoading.hide().then(function(){
                //console.log("The loading indicator is now hidden");
            });
        }
    };

    $scope.info = {};
    $scope.ad_switch = true;

    $http.get( common_ops.buildUrl("/v1/emoticon/default/info",params),{ timeout:global_config.timeout } )
    .success(function( res ) {
        $scope.info = res.data;
    }).finally(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });


    $scope.goBack = function(){
        //$ionicHistory.goBack();
        $state.go("tabs.index");
    };

    $scope.share2wechat = function(){
        var share_info = {
            url:$scope.info.current.share_url,
            thumb:$scope.info.current.small_url,
            callback:$scope.share_callback
        };

        share_ops.wechat(share_info)
    };

    $scope.share2qq = function(){
        var share_info = {
            url:$scope.info.current.share_url,
            thumb:$scope.info.current.small_url,
            callback:$scope.share_callback
        };

        share_ops.qq(share_info)
    };

    $scope.share_callback = function(){
        indicator_ops.show();
    };

    $scope.openPopover = function(){
        $scope.openModal();
    };

    $ionicModal.fromTemplateUrl('my-popover.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
});

app.controller("findCtrl",function($scope){
    $scope.openUrl= function( url ){
        cordova.InAppBrowser.open( encodeURI( url ), '_blank', 'location=no,,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
    };

    $scope.list = [
        { icon:'img/kweather.png',title:'天气',url:'https://m.baidu.com/s?word=天气预报' },
        { icon:'img/package.png',title:'快递查询',url:'http://m.kuaidi100.com/uc/index.html' },
        { icon:'img/happy_face.png',title:'爆笑图片',url:'http://m.budejie.com/pic/'},
        { icon:'img/video.png',title:'爆笑视频',url:'http://m.budejie.com/video/' },
        { icon:'img/smiling_girl.png',title:'最新笑话',url:'http://m.budejie.com/text/' }
    ];
});

app.controller("aboutCtrl",function($scope){
    $scope.openUrl= function( url ){
        cordova.InAppBrowser.open( encodeURI( url ), '_blank', 'location=no,,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
    };
});
