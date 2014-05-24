'use strict';

showMyStackApp.controller('LoginController', ['$scope', 'AuthService', 'AlertsHandlerService', '$state',
    function($scope, AuthService, AlertsHandlerService, $state) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.login = function() {
            AlertsHandlerService.clearAll();

            AuthService.login($scope.user).then(function() {
                $state.go('authorized.main');
            });
        };
    }
]);
