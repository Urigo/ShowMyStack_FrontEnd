'use strict';

showMyStackApp.controller('AddEditStackController', ['$scope', 'StacksService', 'GithubService', 'AlertsHandlerService', 'languages', '$filter', 'DataService', '$state', 'stackInfo',
    function($scope, StacksService, GithubService, AlertsHandlerService, languages, $filter, DataService, $state, stackInfo) {
        $scope.pageTitle = $state.current.title;
        $scope.buttonText = $state.current.doActionText;

		$scope.addEditStackObj = {
			title: '',
			githubUrl: '',
			languages: []
		};

		$scope.isEdit = false;
        $scope.languages = languages;
		$scope.selectedLanguages = [];
		$scope.multiselectDropdownLanguagesOptions = {displayProp: 'langName', idProp: '_id', externalIdProp: 'lang'};
		$scope.multiselectDropdownFrameworkOptions = {displayProp: 'frameworkName', idProp: '_id', externalIdProp: 'framework'};

		if (angular.isDefined(stackInfo))
		{
			$scope.isEdit = true;
			$scope.addEditStackObj.title = stackInfo.title;
			$scope.addEditStackObj.githubUrl = stackInfo.githubUrl;
			$scope.selectedLanguages = angular.copy(stackInfo.languages);
			console.log($scope.selectedLanguages);
		}

		$scope.getSingleObjectFromArrayById = function(arr, obj, idProp)
		{
			var findObj = {};
			findObj._id = obj[idProp];

			return $filter('filter')(arr, findObj)[0];
		};

		$scope.compareExtensionObject = function(ext1, ext2)
		{
			return ext1.extension === ext2.extension;
		};

        $scope.$watch('selectedLanguages', function(newValue) {
			angular.forEach(newValue, function(selectedLang)
			{
				var langObject = _.find($scope.languages, {_id: selectedLang.lang});

				 angular.forEach(selectedLang.frameworks, function(selectedFw) {
					 var fwObject = _.find(langObject.frameworks, {_id: selectedFw.framework});

					 if (!fwObject.hasOwnProperty('extensions'))
					 {
						 DataService.getExtensionsByFrameworkAndLanguage(selectedFw.framework, selectedLang.lang).then(function(response) {
							 fwObject.extensions = response.extensions;
							 fwObject.categories = response.categories;
							 fwObject.categories.push({
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

        // add/edit action
        $scope.addEditStack = function() {
			$scope.addEditStackObj.languages = angular.copy($scope.selectedLanguages);

            if ($scope.isEdit) {
                StacksService.edit(stackInfo._id, $scope.addEditStackObj).then(function() {
                    $state.go('authorized.viewStack', {stackId: stackInfo._id});
                });
            } else {
                StacksService.add($scope.addEditStackObj).then(function(response) {
					$state.go('authorized.viewStack', {stackId: response._id})
                });
            }
        };
    }
]);