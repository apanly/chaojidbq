;
(function (window, document) {
    window.share_ops = {
        wechat:function( share_info ){//分享到微信回话
            if (typeof Wechat === "undefined") {
                alert("没有安装微信~~");
                return false;
            }

            //0 回话  2：朋友圈  3：收藏
            var params = {
                scene: 0,
                message:{
                    title: "超级逗表情",
                    description: "超级逗表情,微信 QQ斗图",
                    mediaTagName: "cjdbq",
                    messageExt: "超级逗表情",
                    messageAction: "<action>share</action>",
                    media: {}
                }
            };

            params.message.thumb = share_info.thumb;
            params.message.media.type = Wechat.Type.EMOTION;
            params.message.media.emotion = share_info.url;


            Wechat.share(params, function () {
                share_info.callback();
            }, function (reason) {
                alert("失败: " + reason);
                return false;
            });
            return true;

        },
        qq:function( share_info ){//分享到qq
            if (typeof YCQQ === "undefined") {
                alert("没有安装QQ~~");
                return false;
            }

            var args = {
                url:share_info.url,
                title:"超级逗表情",
                description:"超级逗表情,微信 QQ斗图",
                imageUrl:share_info.url,
                file_name:'123.gif',
                appName:"超级逗表情"
            };

            YCQQ.shareToQQ(function(){
                share_info.callback();
            },function(failReason){
                if(  failReason != "cancelled by user" ){
                    alert("失败: " + failReason);
                }

                return false;
            },args);
        }
    };
})(window, document);