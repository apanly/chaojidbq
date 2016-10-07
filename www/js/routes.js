angular.module('ionic.routes', [])
.config(function( $stateProvider,$urlRouterProvider ){
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
})