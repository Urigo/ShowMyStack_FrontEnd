'use strict';

showMyStackApp.controller('AddStackController', ['$scope', 'StacksService', 'GithubService',
    function($scope, StacksService, GithubService) {
        $scope.stack = {
            title: '',
            githubUrl: '',
            thirdParties: [],
            languages: []
        };

        $scope.gitHubInfo = null;

        $scope.$watch('stack.githubUrl', function(newValue) {
            if (angular.isDefined(newValue) && newValue !== '') {
                var regexVerify = /([A-Za-z0-9]+@|http(|s)\:\/\/)([A-Za-z0-9.]+)(:|\/)([A-Za-z0-9\/]+)(:|\/)([A-Za-z0-9\/]+)(\.git)?/g.exec(newValue);

                if (regexVerify !== null) {
                    GithubService.getRepoInfo({
                        user: regexVerify[5],
                        repo: regexVerify[7],
                    }, function(response) {
                        $scope.gitHubInfo = response.data;
                        var langs = angular.copy($scope.stack.languages);
                        langs.push($scope.gitHubInfo.language);
                        $scope.stack.languages = langs;
                    });
                }

            }
        });

        $scope.addStack = function() {
            StacksService.add($scope.stack).then(function() {
                AlertsHandlerService.addSuccess('Stack Successfully added!');
            });
        };
    }
]);
