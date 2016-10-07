angular.module('ionic.controllers', [])
    .controller("indexCtrl", function ($scope,$http,$ionicLoading,$timeout,$ionicScrollDelegate,$q,global_config) {
    // 版本更新提醒
    //AppUpdateService.checkVersion();
    $scope.images = [];
    var params = {
        p:0
    };
    var isRefreshing = false;


    var indicator_ops = {
        show:function(){
            $ionicLoading.show({
                template: '拼命加载...',
                animation: 'fade-in',
                showBackdrop: true
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
        $scope.domore = false;
        isRefreshing = true;
        $scope.loadMore();
    };

    $scope.domore = false;

    $scope.loadMore = function(){
        params.p++;
        indicator_ops.show();
        http_request().then(function(list) {
            indicator_ops.hide();
            if (isRefreshing) {
                //clear isRefreshing flag
                isRefreshing = false;
                //empty the list (delete old data) before appending new data to the end of the list.
                $scope.images.splice(0);
                //hide the spin
                $timeout(function() {
                    $scope.$broadcast("scroll.refreshComplete");
                }, 500);
            }
            //Check whether it has reached the end
            if (list.length <= 0 ) $scope.domore = true;

            //append new data to the list
            $scope.images = $scope.images.concat(list);

            //hides the spin
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);


            //notify ion-content to resize after inner height has changed.
            //so that it will trigger infinite scroll again if needed.
            if (list.length > 0 ){
                $timeout(function(){
                    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                });
            }

        });
    };

    /*
     * @param state  1 => fresh 2 => load more
     */
    function http_request(  ){
        var list = [];
        var deferred = $q.defer();

        $http.get( common_ops.buildUrl("/v1/emoticon/default/index",params),{ timeout:global_config.timeout } )
            .success(function( res ) {
                var data = res.data;
                for( var idx in data ){
                    list.push( data[idx] );
                }
                deferred.resolve(list);
            }).error(function (errorData, errorStatus, errorHeaders, errorConfig) {
            //deferred.reject();
            deferred.resolve(list);
        });

        return deferred.promise;
    };
    //第一次进来就
    $scope.doRefresh();


})
    .controller("infoCtrl", function ($scope,$state, $ionicModal,$ionicHistory,$stateParams,$window,$http,$ionicLoading,global_config) {

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
        });


    $scope.goBack = function(){
        if( $ionicHistory.backView() ){
            $ionicHistory.goBack();
        }else{
            $state.go("tabs.index");
            
        }
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
})
    .controller("findCtrl",function($scope,$http,global_config){
        $scope.openUrl= function( url ){
        cordova.InAppBrowser.open( encodeURI( url ), '_blank', 'location=no,,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
    };

    $scope.list = [
        { icon:'img/kweather.png',title:'天气',url:'https://m.baidu.com/s?word=天气预报' },
        { icon:'img/package.png',title:'快递查询',url:'http://m.kuaidi100.com/uc/index.html' },
        { icon:'img/happy_face.png',title:'爆笑图片',url:'http://m.budejie.com/pic/'},
        { icon:'img/video.png',title:'爆笑视频',url:'http://m.budejie.com/video/' }
    ];

    $http.get( common_ops.buildUrl("/v1/emoticon/default/find"),{ timeout:global_config.timeout } )
        .success(function( res ) {
            $scope.list = res.data;
        });
})
    .controller("aboutCtrl",function($scope){
        $scope.openUrl= function( url ){
            cordova.InAppBrowser.open( encodeURI( url ), '_blank', 'location=no,,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
        };
    });
