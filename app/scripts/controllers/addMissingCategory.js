'use strict';

showMyStackApp.controller('AddMissingCategoryController', ['$scope', '$modalInstance', 'DataService', 'languages', 'languageId',
	function($scope, $modalInstance, DataService, languages, languageId)
	{
		$scope.addCategoryObj = {};
		$scope.languages = languages;
		$scope.multiselectDropdownLangsOptions = {displayProp: 'langName', idProp: '_id', externalIdProp: '_id'};
		$scope.selectedLanguages = [{id: languageId}];

		$scope.addCategory = function()
		{
			var tempObj = angular.copy($scope.addCategoryObj);
			tempObj.languages = _.pluck($scope.selectedLanguages, '_id');

			DataService.addCategory(tempObj).then(function(response) {
				$modalInstance.close(response);
			});
		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);