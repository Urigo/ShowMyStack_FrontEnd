'use strict';

showMyStackApp.controller('HeaderController', ['$scope', 'User',
    function($scope, User) {
        $scope.userDetails = User.getUser();
    }
]);
