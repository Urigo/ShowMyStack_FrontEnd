'use strict';

showMyStackApp.controller('RegisterController', ['$scope', 'AuthService', 'AlertsHandlerService',
    function($scope, AuthService, AlertsHandlerService) {
        $scope.user = {
            email: '',
            password: ''
        };

        $scope.register = function() {
            AlertsHandlerService.clearAll();

            AuthService.register($scope.user).then(function() {
                AlertsHandlerService.addSuccess('Successfully registered!');
            });
        };
    }
]);
