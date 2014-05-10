'use strict';

showMyStackApp.controller('MainController', ['$scope', 'stacks', 'categories',
    function($scope, stacks, categories) {
        $scope.stacks = stacks;
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
