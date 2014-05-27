'use strict';

showMyStackApp.controller('AddMissingCategoryController', ['$scope', '$modalInstance', 'DataService', 'languages',
	function($scope, $modalInstance, DataService, languages)
	{
		$scope.addCategoryObj = {};
		$scope.languages = languages;
		$scope.multiselectDropdownLangsOptions = {displayProp: 'langName', idProp: '_id', externalIdProp: 'id'};
		$scope.selectedLanguages = [];

		$scope.addCategory = function()
		{
			var tempObj = angular.copy($scope.addCategoryObj);
			tempObj.languages = _.pluck($scope.selectedLanguages, 'id');

			DataService.addCategory(tempObj).then(function(response) {
				$modalInstance.close(response);
			});
		};

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);