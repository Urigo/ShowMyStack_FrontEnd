'use strict';

var showMyStackApp = angular
    .module('showMyStackApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.router',
        'ui.bootstrap',
        'restangular',
        'ngStorage'
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Angular UI Router config
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('main', {
                    url: '/',
                    controller: 'MainController',
                    templateUrl: 'views/main.html'
                })
                .state('login', {
                    url: '/login',
                    controller: 'LoginController',
                    templateUrl: 'views/login.html'
                })
                .state('register', {
                    url: '/register',
                    controller: 'RegisterController',
                    templateUrl: 'views/register.html'
                })
                .state('authorized', {
                    abstract: true,
                    templateUrl: 'views/authrize_template.html',
                })
                .state('authorized.addStack', {
                    url: '/addStack',
                    controller: 'AddStackController',
                    templateUrl: 'views/add_stack.html'
                })
                .state('authorized.profile', {
                    url: '/profile',
                    controller: 'ProfileController',
                    templateUrl: 'views/profile.html'
                });

        }
    ])
    .config(['RestangularProvider', 'serverUrl',
        function(RestangularProvider, serverUrl) {
            // Restangular config
            RestangularProvider.setBaseUrl(serverUrl);

            RestangularProvider.addElementTransformer('users', true, function(users) {
                users.addRestangularMethod('getMyProfile', 'get', '');

                return users;
            });

            RestangularProvider.addElementTransformer('stacks', true, function(stacks) {
                stacks.addRestangularMethod('add', 'post', 'add');

                return stacks;
            });

            RestangularProvider.addElementTransformer('auth', true, function(auth) {
                auth.addRestangularMethod('register', 'post', 'register');
                auth.addRestangularMethod('login', 'post', 'login');
                auth.addRestangularMethod('fbLogin', 'post', 'fbLogin');
                auth.addRestangularMethod('fbRegister', 'post', 'fbRegister');

                return auth;
            });
        }
    ])
    .run(['Restangular', 'AlertsHandlerService', 'User',
        function(Restangular, AlertsHandlerService, User) {
            // Set interceptor for errors from the server
            Restangular.setErrorInterceptor(
                function(resp) {
                    if (angular.isObject(resp.data.message) && resp.data.message.name === 'MongoError') {
                        AlertsHandlerService.addError(resp.data.message.err);
                    } else {
                        AlertsHandlerService.addError(resp.data.message);
                    }

                    return false;
                });

            Restangular.setDefaultHeaders({
                Authorization: 'Bearer ' + User.getAuthToken()
            });
        }
    ]);
