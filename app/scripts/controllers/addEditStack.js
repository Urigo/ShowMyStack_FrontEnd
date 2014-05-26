'use strict';

showMyStackApp.controller('AddEditStackController', ['$scope', 'StacksService', 'GithubService', 'AlertsHandlerService', 'languages', '$filter', 'DataService', '$state', 'stackInfo', '$modal', 'categories',
    function($scope, StacksService, GithubService, AlertsHandlerService, languages, $filter, DataService, $state, stackInfo, $modal, categories) {
        $scope.pageTitle = $state.current.title;
        $scope.buttonText = $state.current.doActionText;
		$scope.categories = categories;
		$scope.isEdit = false;
        $scope.languages = languages;
		$scope.selectedLanguages = {};
		$scope.selectedTools = {};
		$scope.tools = [];
		$scope.searchLangs = '';

		$scope.addEditStackObj = {
			title: '',
			githubUrl: '',
			languages: []
		};

		$scope.languageListEvents = {
			lastClickedChanged: function(newItem)
			{
				$scope.onWorkLanguage = newItem;

				if (angular.isDefined($scope.onWorkCategory))
				{
					$scope.loadTools();
				}
			}
		};

		$scope.categoryListEvents = {
			lastClickedChanged: function(newItem)
			{
				$scope.onWorkCategory = newItem;
				$scope.loadTools();
			}
		};

		$scope.loadTools = function()
		{
			DataService.getToolsByLanguageAndCategory($scope.onWorkLanguage._id, $scope.onWorkCategory._id).then(function(response)
			{
				$scope.tools = response;
			});
		};


		if (angular.isDefined(stackInfo))
		{
			$scope.isEdit = true;
			$scope.addEditStackObj.title = stackInfo.title;
			$scope.addEditStackObj.githubUrl = stackInfo.githubUrl;
			$scope.selectedLanguages = angular.copy(stackInfo.languages);
		}

		$scope.filterCategories = function(category)
		{
			return $filter('filter')(category.languages, $scope.onWorkLanguage._id).length > 0;
		};

		/*
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
							 fwObject.cleanCategories = response.categories;
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
                        repo: regexVerify[7].replace('/', '')
                    }, function(response) {
                        $scope.gitHubInfo = response.data;
                    });
                }
            }
        });
        */

		$scope.addMissingCategory = function(language)
		{
			var modalInstance = $modal.open({
				templateUrl: 'views/addMissingCategory.html',
				controller: 'AddMissingCategoryController'});

			modalInstance.result.then(function (createdObj) {

			});
		};

		$scope.AddMissingTool = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'views/addMissingTool.html',
				controller: 'AddMissingToolController',
				resolve: {
					languageId: function() {
						return $scope.onWorkLanguage._id;
					},
					categories: function()
					{
						var relevantCategories = $filter('filter')($scope.categories, $scope.filterCategories);
						return relevantCategories;
					}
				}});

			modalInstance.result.then(function (createdObj) {

			});
		};

        // add/edit action
        $scope.addEditStack = function() {
			$scope.addEditStackObj.languages = angular.copy($scope.selectedLanguages);

            if ($scope.isEdit) {
                StacksService.edit(stackInfo._id, $scope.addEditStackObj).then(function() {
                    $state.go('authorized.viewStack', {stackId: stackInfo._id});
                });
            } else {
                StacksService.add($scope.addEditStackObj).then(function(response) {
					$state.go('authorized.viewStack', {stackId: response._id});
                });
            }
        };
    }
]);