'use strict';

showMyStackApp.service('GithubService', ['Restangular',
    function(Restangular) {
		var githubState = Restangular.all('github');

        this.getRepoInfo = function(infoObj) {
			return githubState.one('repo', infoObj.user).one(infoObj.repo).get();
        };

        this.getReadme = function(infoObj) {
			return githubState.one('readme', infoObj.user).one(infoObj.repo).get();
        };
    }
]);
