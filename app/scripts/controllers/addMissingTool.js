'use strict';

showMyStackApp.controller('AddMissingToolController', ['$scope', '$modalInstance', 'GithubService', 'DataService', 'languageId', 'categories', 'categoryId',
	function($scope, $modalInstance, GithubService, DataService, languageId, categories, categoryId)
	{
		$scope.categories = categories;
		$scope.addToolObj = {};
		$scope.selectedCategories = [{id: categoryId}];
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
					$scope.addToolObj.toolName = response.data.name || '';
				});

				GithubService.getRepoInfo({
					user: newValue.username,
					repo: newValue.repo,
					spec: 'tags'
				}, function(response) {
					$scope.addToolObj.versions = _.pluck(response.data || [], 'name');
				});
			}
		}, true);

		$scope.addTool = function()
		{
			var tempObj = angular.copy($scope.addToolObj);
			tempObj.language = languageId;
			tempObj.categories = _.pluck($scope.selectedCategories, 'id');

			var versArray = [];

			angular.forEach(tempObj.versions, function(value) {
				versArray.push({
					versionNumber: value,
					ghUrl: ''
				});
			});

			tempObj.versions = versArray;

			DataService.addTool(tempObj).then(function(response) {
				$modalInstance.close(response);
			});
		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);