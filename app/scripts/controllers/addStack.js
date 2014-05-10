'use strict';

showMyStackApp.controller('AddStackController', ['$scope', 'StacksService', 'GithubService', 'AlertsHandlerService', 'languages',
    function($scope, StacksService, GithubService, AlertsHandlerService, languages) {
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
        $scope.stack = {
            title: '',
            githubUrl: '',
            languages: []
        };

        // GitHub info object
        $scope.gitHubInfo = null;

        $scope.$watch('stack.githubUrl', function(newValue) {
            if (angular.isDefined(newValue) && newValue !== '') {
                var regexVerify = /([A-Za-z0-9]+@|http(|s)\:\/\/)([A-Za-z0-9.]+)(:|\/)([A-Za-z0-9\/]+)(:|\/)(.*)(\.git)?/g.exec(newValue);

                if (regexVerify !== null) {
                    GithubService.getRepoInfo({
                        user: regexVerify[5],
                        repo: regexVerify[7],
                    }, function(response) {
                        $scope.gitHubInfo = response.data;
                    });
                }

            }
        });

        // Add new stack action
        $scope.addStack = function() {
            console.log($scope.selectedLanguages);
            /*
            StacksService.add($scope.stack).then(function() {
                AlertsHandlerService.addSuccess('Stack Successfully added!');
            });*/
        };
    }
]);
