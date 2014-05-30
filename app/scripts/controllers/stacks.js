'use strict';

showMyStackApp.controller('StacksController', ['$scope', 'StacksService', 'GithubService', 'AlertsHandlerService', 'languages', '$filter', 'DataService', '$state', '$modal', 'categories', 'stacks', 'tools',
    function($scope, StacksService, GithubService, AlertsHandlerService, languages, $filter, DataService, $state, $modal, categories, stacks, tools) {
		$scope.stacks = stacks;
		$scope.categories = categories;
        $scope.languages = languages;
		$scope.tools = tools;

		$scope.filteredCategories = [];
		$scope.filteredTools = [];

		$scope.selectedLang = undefined;
		$scope.selectedCat = undefined;

		$scope.checkedStacksModel = [];
		$scope.checkedLangsModel = [];
		$scope.checkedCatsModel = [];
		$scope.checkedToolsModel = [];

		$scope.stacksListSettings = {idProp: '_id', displayProp: 'title', externalIdProp: '', checkables: false};
		$scope.langsListSettings = {idProp: '_id', displayProp: 'langName', externalIdProp: 'lang'};
		$scope.catsListSettings = {idProp: '_id', displayProp: 'categoryName', externalIdProp: '', checkables: false};
		$scope.toolsListSettings = {idProp: '_id', displayProp: 'toolName', externalIdProp: 'tool'};

		$scope.stacksListEvents = {
			itemClicked: function(clickedStack)
			{
				$scope.selectedStack = clickedStack;
				$scope.checkedLangsModel = $scope.selectedStack.languages;
				$scope.selectedCat = undefined;
			}};

		$scope.langsListEvents = {
			itemClicked: function(clickedLang)
			{
				$scope.selectedCat = undefined;

				$scope.selectedLang = clickedLang;

				var lang = $filter('filter')($scope.selectedStack.languages, {lang: $scope.selectedLang._id})[0];

				if (angular.isUndefined(lang.tools))
				{
					lang.tools = [];
				}

				$scope.checkedToolsModel = lang.tools;
			}};

		$scope.catsListEvents = {
			itemClicked: function(clickedCat)
			{
				$scope.selectedCat = clickedCat;
			}
		};

		$scope.$watch('checkedToolsModel', function(newValue)
		{
			console.log(newValue);
		});

		$scope.rebuildFilteredCategories = function(selectedLang)
		{
			var catsArr = [];

			angular.forEach($scope.categories, function (category) {
				if ($filter('filter')(category.languages, selectedLang._id).length > 0) {
					catsArr.push(category);
				}
			});


			$scope.filteredCategories = catsArr;
		};

		$scope.rebuildFilteredTools = function(selectedLang, selectedCategory)
		{
			var toolsArr = [];

			angular.forEach($scope.tools, function (tool) {
				var relevantLangs = $filter('filter')(tool.language, function(value) {
					return value === selectedLang._id;
				});

				var relevantCats = $filter('filter')(tool.categories, function(value)
				{
					return value === selectedCategory._id;
				});

				if (relevantLangs.length > 0 && relevantCats.length > 0) {
					toolsArr.push(tool);
				}
			});


			$scope.filteredTools = toolsArr;
		};

		$scope.$watch('selectedLang', function(newValue)
		{
			if (angular.isDefined(newValue))
			{
				$scope.rebuildFilteredCategories(newValue);

				if (angular.isDefined($scope.selectedCat))
				{
					$scope.rebuildFilteredTools(newValue, $scope.selectedCat);
				}
			}
		});

		$scope.$watch('selectedCat', function(newValue)
		{
			if (angular.isDefined(newValue))
			{
				$scope.rebuildFilteredTools($scope.selectedLang, newValue);
			}
		});

		$scope.addMissingCategory = function(language)
		{
			var modalInstance = $modal.open({
				templateUrl: 'views/add_missing_category.html',
				controller: 'AddMissingCategoryController',
				resolve: {
					languages: function()
					{
						return $scope.languages;
					}
				}
			});

			modalInstance.result.then(function (createdObj) {
				$scope.categories.push(createdObj);
				$scope.rebuildFilteredCategories($scope.selectedLang);
			});
		};

		$scope.addMissingTool = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'views/add_missing_tool.html',
				controller: 'AddMissingToolController',
				resolve: {
					languageId: function() {
						return $scope.selectedLang._id;
					},
					categories: function()
					{
						return $scope.categories;
					}
				}});

			modalInstance.result.then(function (createdObj) {
				$scope.tools.push(createdObj);
				$scope.rebuildFilteredTools($scope.selectedLang, $scope.selectedCat);
			});
		};

		$scope.addNewStack = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'views/add_stack.html',
				controller: 'AddStackController'
			});

			modalInstance.result.then(function (createdObj) {
				$scope.stacks.push(createdObj);
			});
		};

        $scope.saveStack = function() {
			var stackObj = angular.copy($scope.selectedStack);
			delete stackObj._id;
			delete stackObj.createdAt;
			delete stackObj.updatedAt;
			delete stackObj.__v;

			StacksService.edit($scope.selectedStack._id, stackObj).then(function(response) {
				AlertsHandlerService.addSuccess('Stack "' + stackObj.title + '" Successfully Updated!');
			});
        };
    }
]);