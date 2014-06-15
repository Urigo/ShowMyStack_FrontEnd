'use strict';

showMyStackApp.controller('GithubLoginController', ['$scope', 'User', '$stateParams', 'AuthService', '$state',
	function($scope, User, $stateParams, AuthService, $state) {
		var code = $stateParams.code;

		$scope.isWorking = true;

		if (angular.isDefined(code))
		{
			AuthService.setGithubToken(code).then(function(user)
			{
				User.setUserFromResponse(user);
				$state.go('authorized.stacks');
			});
		}
	}
]);
