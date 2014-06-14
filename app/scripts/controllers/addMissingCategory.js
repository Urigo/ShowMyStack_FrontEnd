'use strict';

showMyStackApp.controller('AddMissingCategoryController', ['$scope', '$modalInstance', 'DataService', 'languages', 'languageId', 'category', 'categories', '$filter',
	function($scope, $modalInstance, DataService, languages, languageId, category, categories, $filter)
	{
		$scope.fatherCategories = $filter('filter')(categories, function(cat)
		{
			return angular.isUndefined(cat.parentCategory) || cat.parentCategory === null;
		});

		$scope.fatherCategories.unshift({categoryName: 'No Parent', _id: null});

		$scope.multiselectDropdownParentOptions = {
			displayProp: 'categoryName',
			idProp: '_id',
			externalIdProp: '_id',
			selectionLimit: 1
		};

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

			$scope.selectedParentCategory = {}; // TODO
		}
		else
		{
			$scope.addCategoryObj = {};
			$scope.selectedLanguages = [{'_id': languageId}];
			$scope.selectedParentCategory = {_id: null};
		}

		$scope.languages = languages;
		$scope.multiselectDropdownLangsOptions = {displayProp: 'langName', idProp: '_id', externalIdProp: '_id'};


		$scope.addCategory = function()
		{
			var tempObj = angular.copy($scope.addCategoryObj);
			tempObj.parentCategory = $scope.selectedParentCategory._id;

			if (tempObj.parentCategory === null)
			{
				tempObj.languages = _.pluck($scope.selectedLanguages, '_id');
			}
			else
			{
				tempObj.languages = $filter('filter')($scope.fatherCategories, {_id: tempObj.parentCategory}).languages;
			}

			if ($scope.isEdit)
			{
				delete tempObj._id;
				delete tempObj.createdAt;
				delete tempObj.listPrefix;
				delete tempObj.childs;
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