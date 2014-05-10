'use strict';

showMyStackApp.controller('AdminController', ['$scope', 'DataService', 'AlertsHandlerService', 'languages', 'frameworks', 'categories', '$filter', 'GithubService',
    function($scope, DataService, AlertsHandlerService, languages, frameworks, categories, $filter, GithubService) {
        $scope.languages = angular.copy(languages);
        $scope.categories = angular.copy(categories);
        $scope.frameworks = angular.copy(frameworks);

        function prepareForMultiSelect(obj) {
            obj.ticked = false;

            if (obj.hasOwnProperty('icon')) {
                obj.icon = '<img class="data-image img-rounded" src="' + obj.icon + '" />';
            }
        }

        // GitHub info object
        $scope.gitHubInfo = null;
        $scope.gitHubInfoTags = null;

        $scope.$watch('addExtensionObj.githubUrl', function(newValue) {
            $scope.handleGhUrlChange(newValue, function(info) {
                $scope.addExtensionObj.extensionName = info.name;
            }, function(tags) {
                $scope.addExtensionObj.versions = _.pluck(tags, 'name');
            });
        });

        $scope.$watch('addFrameworkObj.githubUrl', function(newValue) {
            $scope.handleGhUrlChange(newValue, function(info) {
                $scope.addFrameworkObj.frameworkName = info.name;
            }, function(tags) {
                $scope.addFrameworkObj.versions = _.pluck(tags, 'name');
            });
        });

        $scope.handleGhUrlChange = function(newValue, infoCb, tagsCb) {
            if (angular.isDefined(newValue) && newValue !== '') {
                var regexVerify = /([A-Za-z0-9]+@|http(|s)\:\/\/)([A-Za-z0-9.]+)(:|\/)([A-Za-z0-9\-\/]+)(:|\/)(.*)(\.git)?/g.exec(newValue);

                if (regexVerify !== null) {
                    GithubService.getRepoInfo({
                        user: regexVerify[5].replace('/', ''),
                        repo: regexVerify[7].replace('/', ''),
                    }, function(response) {
                        $scope.gitHubInfo = response.data;
                        infoCb($scope.gitHubInfo);
                    });

                    GithubService.getRepoInfo({
                        user: regexVerify[5].replace('/', ''),
                        repo: regexVerify[7].replace('/', ''),
                        spec: 'tags'
                    }, function(response) {
                        $scope.gitHubInfoTags = response.data;
                        tagsCb($scope.gitHubInfoTags);
                    });
                }
            }
        };

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
