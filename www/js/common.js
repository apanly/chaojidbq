;
var common_ops = {
    getBaseUrl:function(){
        var ga_flag = true;
        return ga_flag?"http://api.vincentguo.cn":"http://api.dr.local.com";
    },
    buildUrl:function( path,params){
        var url = this.getBaseUrl() + path;
        var _paramUrl = '';
        if( params ){
            _paramUrl = Object.keys(params).map(function(k) {
                return [encodeURIComponent(k), encodeURIComponent(params[k])].join("=");
            }).join('&');
            _paramUrl = "?"+_paramUrl;
        }
        return url+_paramUrl
    }
};