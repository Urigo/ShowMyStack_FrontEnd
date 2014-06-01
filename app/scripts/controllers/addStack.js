'use strict';

showMyStackApp.controller('AddStackController', ['$scope', '$modalInstance', 'GithubService', 'StacksService', 'tools', 'BowerService', '$modal', 'missingToolHandler',
	function($scope, $modalInstance, GithubService, StacksService, tools, BowerService, $modal, missingToolHandler)
	{
		$scope.addStackObj = {};
		$scope.ghModel = {};
		$scope.isLoadingCheckDeps = false;
		$scope.bowerPackages = [];

		$scope.$watch('ghModel', function(newValue)
		{
			if (angular.isDefined(newValue.url))
			{
				GithubService.getRepoInfo({
					user: newValue.username,
					repo: newValue.repo
				}).then(function(response)
				{
					console.log(response);

					GithubService.getFileContent({
						user: newValue.username,
						repo: newValue.repo,
						filename: 'bower.json'
					}).then(function(bowerResponse)
					{
						if (angular.isDefined(bowerResponse.content))
						{
							var bowerContent = angular.fromJson(atob(bowerResponse.content));

							if (angular.isDefined(bowerContent.dependencies))
							{
								$scope.isLoadingCheckDeps = true;

								angular.forEach(bowerContent.dependencies, function(packageVersion, packageName)
								{
									BowerService.getBowerPackageInfo(packageName).then(function(bowerResponse)
									{
										$scope.bowerPackages.push(bowerResponse);

										if ($scope.bowerPackages.length === Object.keys(bowerContent.dependencies).length)
										{
											$scope.isLoadingCheckDeps = false;
										}
									});
								});
							}
						}
					});
				});
			}
		}, true);

		$scope.addStack = function()
		{
			StacksService.add($scope.addStackObj).then(function(response) {
				$modalInstance.close(response);
			});
		};

		$scope.addMissingTool = function(bowerPackage)
		{
			missingToolHandler({githubUrl: bowerPackage.url, toolName: bowerPackage.name});
		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);