'use strict';

showMyStackApp.controller('AddMissingExtensionController', ['$scope', '$modalInstance', 'GithubService', 'DataService', 'languageId', 'frameworkId', 'categories',
	function($scope, $modalInstance, GithubService, DataService, languageId, frameworkId, categories)
	{
		$scope.categories = categories;
		$scope.addExtensionObj = {};
		$scope.selectedCategories = [];
		$scope.multiselectDropdownCatsOptions = {displayProp: 'categoryName', idProp: '_id', externalIdProp: 'id'};
		$scope.ghModel = {};

		$scope.$watch('ghModel', function(newValue)
		{
			if (angular.isDefined(newValue.url))
			{
				GithubService.getRepoInfo({
					user: newValue.username,
					repo: newValue.repo
				}, function(response) {
					$scope.addExtensionObj.extensionName = response.data.name || '';
				});

				GithubService.getRepoInfo({
					user: newValue.username,
					repo: newValue.repo,
					spec: 'tags'
				}, function(response) {
					$scope.addExtensionObj.versions = _.pluck(response.data || [], 'name');
				});
			}
		}, true);

		$scope.addExtension = function()
		{
			var tempObj = angular.copy($scope.addExtensionObj);
			tempObj.frameworks = [frameworkId];
			tempObj.categories = _.pluck($scope.selectedCategories, 'id');

			var versArray = [];

			angular.forEach(tempObj.versions, function(value) {
				versArray.push({
					versionNumber: value,
					ghUrl: ''
				});
			});

			tempObj.versions = versArray;

			DataService.addExtension(tempObj).then(function(response) {
				$modalInstance.close(response);
			});
		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);