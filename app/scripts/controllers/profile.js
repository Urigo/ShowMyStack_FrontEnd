'use strict';

showMyStackApp.controller('ProfileController', ['$scope', 'User', '$window', 'githubClientKey', 'clientReturnUrl',
    function($scope, User, $window, githubClientKey, clientReturnUrl) {
        $scope.userProfile = {};

        User.getUserProfile().then(function(response) {
            $scope.userProfile = response;
        });

		$scope.loginWithGithub = function()
		{
			$window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + githubClientKey + '&redirect_uri=' + clientReturnUrl + '&scope=user,repo';
		};
    }
]);
