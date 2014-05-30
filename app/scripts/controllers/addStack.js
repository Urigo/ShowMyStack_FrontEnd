'use strict';

showMyStackApp.controller('AddStackController', ['$scope', '$modalInstance', 'GithubService', 'StacksService',
	function($scope, $modalInstance, GithubService, StacksService)
	{
		$scope.addStackObj = {};
		$scope.ghModel = {};

		$scope.$watch('ghModel', function(newValue)
		{
			if (angular.isDefined(newValue.url))
			{
				GithubService.getRepoInfo({
					user: newValue.username,
					repo: newValue.repo
				}, function(response) {

				});
			}
		}, true);

		$scope.addStack = function()
		{
			StacksService.add($scope.addStackObj).then(function(response) {
				$modalInstance.close(response);
			});
		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);