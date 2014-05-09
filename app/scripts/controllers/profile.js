'use strict';

showMyStackApp.controller('ProfileController', ['$scope', 'User',
    function($scope, User) {
        $scope.userProfile = {};

        User.getUserProfile().then(function(response) {
            $scope.userProfile = response;
        });
    }
]);
