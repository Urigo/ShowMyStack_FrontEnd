'use strict';

showMyStackApp.controller('AdminController', ['$scope', 'DataService', 'AlertsHandlerService', 'languages', 'frameworks', 'categories', '$filter',
    function($scope, DataService, AlertsHandlerService, languages, frameworks, categories, $filter) {
        $scope.languages = angular.copy(languages);
        $scope.categories = angular.copy(categories);
        $scope.frameworks = angular.copy(frameworks);

        function prepareForMultiSelect(obj) {
            obj.ticked = false;

            if (obj.hasOwnProperty('icon')) {
                obj.icon = '<img class="data-image img-rounded" src="' + obj.icon + '" />';
            }
        }

        angular.forEach($scope.categories, function(cat) {
            prepareForMultiSelect(cat);
        });

        angular.forEach($scope.frameworks, function(fw) {
            prepareForMultiSelect(fw);
        });

        angular.forEach($scope.languages, function(lang) {
            prepareForMultiSelect(lang);

            angular.forEach(lang.frameworks, function(fw) {
                prepareForMultiSelect(fw);

                angular.forEach(fw.versions, function(ver) {
                    prepareForMultiSelect(ver);
                });
            });
        });

        $scope.addLangObj = {
            langName: '',
            icon: ''
        };

        $scope.addCategoryObj = {
            categoryName: '',
            languages: []
        };

        $scope.addExtensionObj = {
            extensionName: '',
            githubUrl: '',
            versions: [],
            frameworks: [],
            categories: []
        };

        $scope.addFrameworkObj = {
            frameworkName: '',
            icon: '',
            githubUrl: '',
            languageId: -1,
            versions: []
        };

        $scope.addExtensionSelectedLangId = null;
        $scope.relevateCategories = [];
        $scope.relevantFrameworks = [];

        $scope.$watch('languages', function() {
            var selectedLang = $filter('filter')($scope.languages, {
                ticked: true
            });

            $scope.addExtensionSelectedLangId = _.pluck(selectedLang, '_id')[0];

            $scope.relevateCategories = $filter('filter')($scope.categories, function(obj) {
                return _.indexOf(obj.languages, $scope.addExtensionSelectedLangId) !== -1;
            });

            $scope.relevantFrameworks = $filter('filter')($scope.frameworks, {
                languageId: $scope.addExtensionSelectedLangId
            });
        }, true);


        $scope.addCategory = function() {
            var tempObj = angular.copy($scope.addCategoryObj);

            var frameworksIds = $filter('filter')($scope.languages, {
                ticked: true
            });

            tempObj.languages = _.pluck(frameworksIds, '_id');

            DataService.addCategory(tempObj).then(function() {
                AlertsHandlerService.addSuccess('Category Successfully Added!');
            });
        };

        $scope.addExtension = function() {
            var tempObj = angular.copy($scope.addExtensionObj);

            tempObj.categories = _.pluck($filter('filter')($scope.relevateCategories, {
                ticked: true
            }), '_id');

            tempObj.frameworks = _.pluck($filter('filter')($scope.relevantFrameworks, {
                ticked: true
            }), '_id');

            var versArray = [];

            angular.forEach(tempObj.versions, function(value) {
                versArray.push({
                    versionNumber: value,
                    ghUrl: ''
                });
            });

            tempObj.versions = versArray;

            DataService.addExtension(tempObj).then(function() {
                AlertsHandlerService.addSuccess('Category Successfully Added!');
            });
        };

        $scope.addLang = function() {
            DataService.addLanguage($scope.addLangObj).then(function() {
                AlertsHandlerService.addSuccess('Language Successfully Added!');
            });
        };

        $scope.addFramework = function() {
            var tempCopy = angular.copy($scope.addFrameworkObj);
            var versArray = [];

            angular.forEach(tempCopy.versions, function(value) {
                versArray.push({
                    versionNumber: value,
                    ghUrl: ''
                });
            });

            tempCopy.versions = versArray;

            DataService.addFramework(tempCopy).then(function() {
                AlertsHandlerService.addSuccess('Framework Successfully Added!');
            });
        };
    }
]);
