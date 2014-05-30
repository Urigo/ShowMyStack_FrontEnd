'use strict';

showMyStackApp.controller('ToolInfoController', ['$scope', '$modalInstance', 'tool',
	function($scope, $modalInstance, tool)
	{
		$scope.tool = tool;

		$scope.cancel = function()
		{
			$modalInstance.dismiss();
		};
	}]);