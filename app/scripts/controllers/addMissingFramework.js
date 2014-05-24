'use strict';

showMyStackApp.controller('AddMissingFrameworkController', ['$scope', '$modalInstance', 'GithubService', 'DataService', 'languageId',
	function($scope, $modalInstance, GithubService, DataService, languageId)
{
	console.log(languageId);
	$scope.addFrameworkObj = {};
	$scope.ghModel = {};

	$scope.$watch('ghModel', function(newValue)
	{
		if (angular.isDefined(newValue.url))
		{
			GithubService.getRepoInfo({
				user: newValue.username,
				repo: newValue.repo
			}, function(response) {
				$scope.addFrameworkObj.frameworkName = response.data.name || '';
				$scope.addFrameworkObj.icon = response.data.owner.avatar_url || '';
			});

			GithubService.getRepoInfo({
				user: newValue.username,
				repo: newValue.repo,
				spec: 'tags'
			}, function(response) {
				$scope.addFrameworkObj.versions = _.pluck(response.data || [], 'name');
			});
		}
	}, true);

	$scope.addFramework = function()
	{
		var tempCopy = angular.copy($scope.addFrameworkObj);
		var versArray = [];

		angular.forEach(tempCopy.versions, function(value) {
			versArray.push({
				versionNumber: value,
				ghUrl: ''
			});
		});

		tempCopy.versions = versArray;
		tempCopy.languageId = languageId;

		DataService.addFramework(tempCopy).then(function() {
			$modalInstance.close();
		});

	};

	$scope.cancel = function()
	{
		$modalInstance.dismiss();
	};
}]);