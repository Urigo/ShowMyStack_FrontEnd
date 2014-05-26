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
        'ngStorage',
        'multi-select',
        'checklist-model',
		'angularjs-dropdown-multiselect',
		'angularjs-github-url-input'
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Angular UI Router config
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('authorized.main', {
                    url: '/',
                    controller: 'MainController',
                    templateUrl: 'views/main.html',
                    resolve: {
                        stacks: ['StacksService',
                            function(StacksService) {
                                return StacksService.getAll();
                            }
                        ],
                        categories: ['DataService',
                            function(DataService) {
                                return DataService.getAllCategories();
                            }
                        ]
                    }
                })
				.state('error', {
					url: '/error',
					templateUrl: 'views/errors/server_down.html'
				})
				.state('unauthorized', {
					abstract: true,
					templateUrl: 'views/authorize_template.html'
				})
                .state('unauthorized.login', {
                    url: '/login',
                    controller: 'LoginController',
                    templateUrl: 'views/login.html'
                })
                .state('unauthorized.register', {
                    url: '/register',
                    controller: 'RegisterController',
                    templateUrl: 'views/register.html'
                })
                .state('authorized', {
                    abstract: true,
                    templateUrl: 'views/authorize_template.html'
                })
                .state('authorized.addStack', {
                    url: '/addStack',
                    title: 'Add New Stack',
                    doActionText: 'Add New Stack!',
                    controller: 'AddEditStackController',
                    templateUrl: 'views/add_edit_stack.html',
                    resolve: {
                        languages: ['DataService',
                            function(DataService) {
                                return DataService.getAllLanguages();
                            }
                        ],
                        stackInfo: [
                            function() {
                                return undefined;
                            }
                        ],
						categories: ['DataService', function(DataService)
						{
							return DataService.getAllCategories();
						}]
                    }
                })
                .state('authorized.editStack', {
                    url: '/editStack/:stackId',
                    title: 'Edit Existing Stack',
                    doActionText: 'Save Stack!',
                    controller: 'AddEditStackController',
                    templateUrl: 'views/add_edit_stack.html',
                    resolve: {
                        languages: ['DataService',
                            function(DataService) {
                                return DataService.getAllLanguages();
                            }
                        ],
                        stackInfo: ['StacksService', '$stateParams',
                            function(StacksService, $stateParams) {
                                return StacksService.getById($stateParams.stackId);
                            }
                        ]
                    }
                })
				.state('authorized.viewStack', {
                    url: '/stack/:stackId',
                    controller: 'ViewStackController',
                    templateUrl: 'views/view_stack.html',
                    resolve: {
						categories: ['DataService',
							function(DataService) {
								return DataService.getAllCategories();
							}
						],
                        stackInfo: ['StacksService', '$stateParams',
                            function(StacksService, $stateParams) {
                                return StacksService.getByIdFull($stateParams.stackId);
                            }
                        ]
                    }
                })
                .state('authorized.profile', {
                    url: '/profile',
                    controller: 'ProfileController',
                    templateUrl: 'views/profile.html'
                })
                .state('authorized.logout', {
                    url: '/logout',
                    controller: ['User', '$state',
                        function(User, $state) {
                            User.clearUser();
                            $state.go('unauthorized.login');
                        }
                    ]
                })
                .state('admin', {
                    abstract: true,
                    templateUrl: '../views/authorize_template.html',
                    resolve: {
                        languages: ['DataService',
                            function(DataService) {
                                return DataService.getAllLanguages();
                            }
                        ],
                        categories: ['DataService',
                            function(DataService) {
                                return DataService.getAllCategories();
                            }
                        ]
                    }
                })
                .state('admin.addLang', {
                    url: '/admin/addLang',
                    controller: 'AdminController',
                    templateUrl: 'views/admin/add_lang.html'
                })
                .state('admin.addFramework', {
                    url: '/admin/addFramework',
                    controller: 'AdminController',
                    templateUrl: 'views/admin/add_framework.html'
                })
                .state('admin.addCategory', {
                    url: '/admin/addCategory',
                    controller: 'AdminController',
                    templateUrl: 'views/admin/add_category.html'
                })
                .state('admin.addExtension', {
                    url: '/admin/addExtension',
                    controller: 'AdminController',
                    templateUrl: 'views/admin/add_extension.html'
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
                stacks.addRestangularMethod('getAll', 'get', 'all');

                return stacks;
            });

            RestangularProvider.addElementTransformer('language', true, function(language) {
                language.addRestangularMethod('add', 'post', 'add');
                language.addRestangularMethod('getAll', 'get', 'all');

                return language;
            });


            RestangularProvider.addElementTransformer('category', true, function(category) {
                category.addRestangularMethod('add', 'post', 'add');
                category.addRestangularMethod('getAll', 'get', 'all');

                return category;
            });

            RestangularProvider.addElementTransformer('tool', true, function(extension) {
                extension.addRestangularMethod('add', 'post', 'add');
                extension.addRestangularMethod('getAll', 'get', 'all');

                return extension;
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
    .run(['Restangular', 'AlertsHandlerService', 'User', '$rootScope', '$state',
        function(Restangular, AlertsHandlerService, User, $rootScope, $state) {
			$rootScope.$state = $state;

            // Set interceptor for errors from the server
            Restangular.setErrorInterceptor(
                function(resp) {
					if (resp.status === 0)
					{
						$state.go('error');
					}
					else if (resp.status === 401 && resp.config.url.indexOf('auth/login') === -1)
					{
						$state.go('unauthorized.login');
					}
					else
					{
						if (angular.isObject(resp.data.message) && resp.data.message.name === 'MongoError') {
							AlertsHandlerService.addError(resp.data.message.err);
						} else {
							AlertsHandlerService.addError(resp.data.message);
						}
					}

                    return false;
                });

            Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers)
			{
				if (User.isAuthenticated())
				{
					headers.Authorization = 'Bearer ' + User.getAuthToken();
				}
			});

			$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error)
			{
				console.log(error);
			});
		}
    ]);
