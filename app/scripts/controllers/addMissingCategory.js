'use strict';

showMyStackApp.controller('AddMissingCategoryController', ['$scope', '$modalInstance', 'DataService', 'languages', 'languageId', 'category',
	function($scope, $modalInstance, DataService, languages, languageId, category)
	{
		$scope.isEdit = false;
		$scope.actionName = 'Add Missing';

		if (category !== null)
		{
			$scope.addCategoryObj = category;
			$scope.selectedLanguages = [];

			angular.forEach(category.languages, function(value)
			{
				$scope.selectedLanguages.push({'_id': value});
			});

			$scope.isEdit = true;
			$scope.actionName = 'Edit';
		}
		else
		{
			$scope.addCategoryObj = {};
			$scope.selectedLanguages = [{'_id': languageId}];
		}

		$scope.languages = languages;
		$scope.multiselectDropdownLangsOptions = {displayProp: 'langName', idProp: '_id', externalIdProp: '_id'};


		$scope.addCategory = function()
		{
			var tempObj = angular.copy($scope.addCategoryObj);
			tempObj.languages = _.pluck($scope.selectedLanguages, '_id');

			if ($scope.isEdit)
			{
				delete tempObj._id;
				delete tempObj.createdAt;
				delete tempObj.updatedAt;
				delete tempObj.__v;

				DataService.editCategory($scope.addCategoryObj._id, tempObj).then(function(response) {
					$modalInstance.close(response);
				});
			}
			else
			{
				DataService.addCategory(tempObj).then(function(response) {
					$modalInstance.close(response);
				});
			}

		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);