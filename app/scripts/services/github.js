'use strict';

showMyStackApp.service('GithubService', ['$resource',
    function($resource) {
        var self = this;

        var github = $resource(
            'https://api.github.com/:query/:user/:repo/:spec', {
                'query': '',
                'user': '',
                'repo': '',
                'spec': '',
                'callback': 'JSON_CALLBACK',
                'per_page': 100
            }, {
                'get': {
                    'method': 'JSONP'
                }
            }
        );

        this.getGitHubInfo = function(infoObj, callback) {
            return github.get(infoObj, callback);
        };

        this.getRepoInfo = function(infoObj, callback) {
            angular.extend(infoObj, {
                query: 'repos'
            });
            return self.getGitHubInfo(infoObj, callback);
        };
    }
]);
