'use strict';

showMyStackApp.controller('AddEditStackController', ['$scope', 'StacksService', 'GithubService', 'AlertsHandlerService', 'languages', '$filter', 'DataService', '$state', 'stackInfo',
    function($scope, StacksService, GithubService, AlertsHandlerService, languages, $filter, DataService, $state, stackInfo) {
        $scope.pageTitle = $state.current.title;
        $scope.buttonText = $state.current.doActionText;

        // Prepare the language and frameworks array to work with multiselect directive
        $scope.languages = angular.copy(languages);

        function prepareForMultiSelect(obj) {
            obj.ticked = false;

            if (obj.hasOwnProperty('icon')) {
                obj.icon = '<img class="data-image img-rounded" src="' + obj.icon + '" />';
            }
        }

        angular.forEach($scope.languages, function(lang) {
            prepareForMultiSelect(lang);

            angular.forEach(lang.frameworks, function(fw) {
                prepareForMultiSelect(fw);

                angular.forEach(fw.versions, function(ver) {
                    prepareForMultiSelect(ver);
                });
            });
        });

        // Empty object of the created object
        $scope.addStackObj = {
            title: '',
            githubUrl: '',
            languages: []
        };

        $scope.isEdit = false;

        if ($state.current.name === 'authorized.editStack') {
            $scope.isEdit = true;
            $scope.addStackObj.title = stackInfo.title;
            $scope.addStackObj.githubUrl = stackInfo.githubUrl;

            // Initalize the display object to the data from the server
            angular.forEach(stackInfo.languages, function(lang) {
                var foundLang = $filter('filter')($scope.languages, {
                    _id: lang.lang
                })[0];

                foundLang.ticked = true;

                angular.forEach(lang.frameworks, function(fw) {
                    var foundFw = $filter('filter')(foundLang.frameworks, {
                        _id: fw.framework
                    })[0];
                    foundFw.ticked = true;

                    $filter('filter')(foundFw.versions, {
                        _id: fw.frameworkVersion
                    })[0].ticked = true;

                    foundFw.selectedExtensions = [];

                    DataService.getExtensionsByFrameworkAndLanguage(foundFw._id, foundLang._id).then(function(response) {
                        foundFw.extensions = response.extensions;

                        angular.forEach(fw.extensions, function(ext) {
                            var foundExt = $filter('filter')(foundFw.extensions, {
                                _id: ext.extension
                            })[0];

                            if (ext.hasOwnProperty('version')) {
                                foundExt.selectedVersion = ext.version;
                            }

                            foundFw.selectedExtensions.push(foundExt);
                        });
                    });
                });
            });
        }

        $scope.$watch('languages', function(newValue) {
            angular.forEach(newValue, function(language) {
                language.selectedFrameworks = $filter('filter')(language.frameworks, {
                    ticked: true
                });

                angular.forEach(language.selectedFrameworks, function(fw) {
                    if (!fw.hasOwnProperty('extensions') && !fw.hasOwnProperty('categories')) {
                        DataService.getExtensionsByFrameworkAndLanguage(fw._id, language._id).then(function(response) {
                            fw.extensions = response.extensions;
                            fw.categories = response.categories;
                            fw.categories.push({
                                categoryName: 'All Categories',
                                _id: ''
                            });
                        });
                    }
                });
            });
        }, true);

        $scope.filterExtensions = function(selectedCategories) {
            return function(extension) {
                if (angular.isDefined(selectedCategories)) {

                    var relevant = false;

                    angular.forEach(selectedCategories, function(selectedCat) {
                        if (!relevant) {
                            if (selectedCat._id === '') {
                                relevant = true;
                            } else {
                                relevant = _.indexOf(extension.categories, selectedCat._id) !== -1;
                            }
                        }
                    });

                    return relevant;
                }

                return true;
            };
        };

        // GitHub info object
        $scope.gitHubInfo = null;

        $scope.$watch('stack.githubUrl', function(newValue) {
            if (angular.isDefined(newValue) && newValue !== '') {
                var regexVerify = /([A-Za-z0-9]+@|http(|s)\:\/\/)([A-Za-z0-9.]+)(:|\/)([A-Za-z0-9\-\/]+)(:|\/)(.*)(\.git)?/g.exec(newValue);

                if (regexVerify !== null) {
                    GithubService.getRepoInfo({
                        user: regexVerify[5].replace('/', ''),
                        repo: regexVerify[7].replace('/', ''),
                    }, function(response) {
                        $scope.gitHubInfo = response.data;
                    });
                }
            }
        });

        // Add new stack action
        $scope.addStack = function() {
            var selectedLangs = $filter('filter')($scope.languages, {
                ticked: true
            });

            angular.forEach(selectedLangs, function(lang) {
                var langObject = {};
                langObject.lang = lang._id;
                langObject.frameworks = [];

                angular.forEach(lang.selectedFrameworks, function(fw) {
                    var fwObject = {
                        framework: fw._id,
                        frameworkVersion: '',
                        extensions: []
                    };

                    fwObject.frameworkVersion = $filter('filter')(fw.versions, {
                        ticked: true
                    })[0]._id;

                    angular.forEach(fw.selectedExtensions, function(ext) {
                        var extObject = {
                            extension: ext._id,
                            version: ext.selectedVersion
                        };

                        fwObject.extensions.push(extObject);
                    });

                    langObject.frameworks.push(fwObject);
                });

                $scope.addStackObj.languages.push(langObject);
            });

            if ($scope.isEdit) {
                StacksService.edit(stackInfo._id, $scope.addStackObj).then(function() {
                    AlertsHandlerService.addSuccess('Stack Successfully edited!');
                });
            } else {
                StacksService.add($scope.addStackObj).then(function() {
                    AlertsHandlerService.addSuccess('Stack Successfully added!');
                });
            }
        };
    }
]);