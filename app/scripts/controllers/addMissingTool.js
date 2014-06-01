'use strict';

showMyStackApp.controller('AddMissingToolController', ['$scope', '$modalInstance', 'GithubService', 'DataService', 'languageId', 'categories', 'categoryId', 'languages', 'baseObj',
	function($scope, $modalInstance, GithubService, DataService, languageId, categories, categoryId, languages, baseObj)
	{
		$scope.categories = categories;
		$scope.addToolObj = {};
		$scope.selectedCategories = [];
		$scope.selectedLanguage = languageId;
		$scope.languages = languages;
		$scope.multiselectDropdownLangsOptions = {displayProp: 'langName', idProp: '_id', externalIdProp: 'id'};
		$scope.selectedLanguages = [];
		$scope.addToolObj = angular.extend({}, baseObj);

		if (categoryId !== null)
		{
			$scope.selectedCategories.push({id: categoryId});
		}

		$scope.multiselectDropdownCatsOptions = {displayProp: 'categoryName', idProp: '_id', externalIdProp: 'id'};
		$scope.ghModel = {};

		$scope.$watch('ghModel', function(newValue)
		{
			if (angular.isDefined(newValue.url))
			{
				GithubService.getRepoInfo({
					user: newValue.username,
					repo: newValue.repo
				}).then(function(response) {
					if (!angular.isDefined($scope.addToolObj.toolName))
					{
						$scope.addToolObj.toolName = response.data.name || '';
					}
				});

				GithubService.getRepoTags({
					user: newValue.username,
					repo: newValue.repo
				}).then(function(response) {
					$scope.addToolObj.versions = _.pluck(response || [], 'name');
				});
			}
		}, true);

		$scope.addTool = function()
		{
			var tempObj = angular.copy($scope.addToolObj);

			if ($scope.selectedLanguage === null)
			{
				tempObj.language = _.pluck($scope.selectedLanguages, 'id')[0];
			}
			else
			{
				tempObj.language = languageId;
			}

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