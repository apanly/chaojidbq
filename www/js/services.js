angular.module('ionic.services', [])
    .factory("AppUpdateService", function($http, $q, $timeout, $ionicPopup, $ionicLoading) {
        return {
            checkVersionData: checkVersionData,
            checkVersion: checkVersion
        };

        /**
         * 调用后端接口获取版本更新信息，这里应该换成你自己的逻辑
         */
        function checkVersionData(data) {
            var deferred = $q.defer();
            $http({method: 'GET', url: common_ops.buildUrl("/v1/emoticon/default/update"), params: data}).success(function ( res ) {
                deferred.resolve(res.data);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function checkVersion(scope) {
            if ( !window.cordova ){
                return;
            }
            var deferred = $q.defer();
            // params 是我这边需要传递给后端接口的参数，需更改为你自己的参数
            var params = {
                version: ''
            };
            // 获取手机的网络状态，返回的值包括：WIFI CELL_4G CELL_3G等网络状态，这里用来检测手机是否处于WiFi状态
            var network_target = navigator.connection;

            // 获取App 内的版本信息
            cordova.getAppVersion.getVersionNumber().then(function (version) {
                params.version = version;
                // 获取服务器版本信息，此处需更改为你自己的逻辑
                checkVersionData(params)
                    .then(function (data) {
                        // 该接口返回的updateFlag取值为：0（不更新）、1（普通更新）、2（强制更新）
                        // 判断是否需要更新
                        var json = {
                            title: '',
                            subTitle: data.msg
                        };

                        if (version != data.versionCode ) {
                            if ( network_target && network_target.type == Connection.WIFI ) {
                                json.title = 'APP版本更新'
                            } else {
                                json.title = 'APP版本更新（建议WIFI下升级）';
                            }
                            updateAppPopup(json, scope).then(function (res) {
                                if (res == 'update') {
                                    UpdateForAndroid(data.apk);
                                }
                            });
                        }
                        deferred.resolve( true );
                    }, function (err) {
                        deferred.reject(null);
                    })
            });

            return deferred.promise;
        }

        function updateAppPopup(json, scope) {
            return $ionicPopup.show({
                title: json.title,
                subTitle: json.subTitle,
                scope: scope,
                buttons: [
                    {
                        text: '取消',
                        type: 'button-clear button-assertive',
                        onTap: function () {
                            return 'cancel';
                        }
                    },
                    {
                        text: '更新',
                        type: 'button-clear button-assertive border-left',
                        onTap: function (e) {
                            return 'update';
                        }
                    }
                ]
            });
        }
        function UpdateForAndroid(downloadUrl) {
            $ionicLoading.show({
                template: "已经下载：0%"
            });
            var targetPath = cordova.file.externalApplicationStorageDirectory + "cjdbq.apk";
            var trustHosts = true;
            var options = {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            };
            var fileTransfer = new FileTransfer();
            fileTransfer.onprogress = function(progress) {
                $timeout(function () {
                    var downloadProgress = (progress.loaded / progress.total) * 100;
                    $ionicLoading.show({
                        template: "已经下载：" + Math.floor(downloadProgress) + "%"
                    });
                    if (downloadProgress > 99) {
                        $ionicLoading.hide();
                    }
                });
            };
            fileTransfer.download( encodeURI(downloadUrl), targetPath,function(entry){
                console.log("download complete: " + entry.fullPath);
                cordova.plugins.fileOpener2.open(
                    targetPath,
                    'application/vnd.android.package-archive',
                    {
                        error : function( e ){
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success : function(){
                            console.log('file opened successfully');
                        }
                    }
                );
                $ionicLoading.hide();
            },function(error){
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
                $ionicLoading.show({
                    template: "下载失败"
                });
                $ionicLoading.hide();
            },trustHosts,options);
        }
    })