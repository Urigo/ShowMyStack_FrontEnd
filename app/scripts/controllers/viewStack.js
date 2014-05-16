'use strict';

showMyStackApp.controller('ViewStackController', ['$scope', 'stackInfo', 'categories',
	function($scope, stackInfo, categories) {
		$scope.stack = stackInfo;
		$scope.categories = categories;

		$scope.getCategories = function(extensionCategories) {
			var categories = [];

			var plucked = _.pluck($scope.categories, '_id');

			angular.forEach(extensionCategories, function(cat) {
				var index = _.indexOf(plucked, cat);

				if (index !== -1) {
					categories.push($scope.categories[index]);
				}
			});

			return _.pluck(categories, 'categoryName');
		};
	}
]);
