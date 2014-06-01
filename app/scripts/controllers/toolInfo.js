'use strict';

showMyStackApp.controller('ToolInfoController', ['$scope', '$modalInstance', 'tool', 'githubUrlService', 'GithubService',
	function($scope, $modalInstance, tool, githubUrlService, GithubService)
	{
		$scope.tool = tool;
		$scope.toolReadme = '';

		if (angular.isDefined($scope.tool.githubUrl))
		{
			var urlInfo = githubUrlService.decodeUrl($scope.tool.githubUrl);

			GithubService.getReadme({user: urlInfo.username, repo: urlInfo.repo}).then(function(response)
			{
				$scope.toolReadme = atob(response.content);
			});
		}

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);