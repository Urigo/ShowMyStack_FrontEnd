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

		$scope.stacksListSettings = {idProp: '_id', displayProp: 'title', externalIdProp: '', checkables: false, enableSearch: true};
		$scope.langsListSettings = {idProp: '_id', displayProp: 'langName', externalIdProp: 'lang'};
		$scope.catsListSettings = {idProp: '_id', displayProp: 'categoryName', externalIdProp: '', checkables: false, enableSearch: true, itemButtonText: '<span class="glyphicon glyphicon-edit"></span>', itemPrefixProp: 'listPrefix'};
		$scope.toolsListSettings = {idProp: '_id', displayProp: 'toolName', externalIdProp: 'tool', enableSearch: true, itemButtonText: '<span class="glyphicon glyphicon-info-sign"></span>'};

		$scope.stacksListEvents = {
			itemClicked: function(clickedStack)
			{
				$scope.selectedStack = clickedStack;
				$scope.checkedLangsModel = $scope.selectedStack.languages;
				$scope.selectedCat = undefined;
				$scope.selectedLang = undefined;
			}};

		$scope.langsListEvents = {
			itemClicked: function(clickedLang)
			{
				$scope.selectedLang = clickedLang;

				var lang = $filter('filter')($scope.selectedStack.languages, {lang: $scope.selectedLang._id})[0];

				if (angular.isDefined(lang))
				{
					if (angular.isUndefined(lang.tools))
					{
						lang.tools = [];
					}

					$scope.checkedToolsModel = lang.tools;
				}
			}};

		$scope.catsListEvents = {
			itemClicked: function(clickedCat)
			{
				$scope.selectedCat = clickedCat;
			},
			itemButtonAction: function(item)
			{
				$scope.addMissingCategory(item);
			}
		};

		$scope.toolsListEvents = {
			itemButtonAction: function(item)
			{
				var modalInstance = $modal.open({
					templateUrl: 'views/tool_info.html',
					controller: 'ToolInfoController',
					resolve: {
						tool: function()
						{
							return item;
						}
					}
				});
			}
		};

		$scope.rebuildFilteredCategories = function(selectedLang)
		{
			var catsArr = [];

			angular.forEach($scope.categories, function (category) {
				if (angular.isUndefined(category.parentCategory) || category.parentCategory === null)
				{
					if ($filter('filter')(category.languages, selectedLang._id).length > 0) {
						category.listPrefix = '';
						category.childs = [];
						catsArr.push(category);

						angular.forEach($filter('filter')($scope.categories, {parentCategory: category._id}), function(sonCat)
						{
							sonCat.listPrefix = '<img src="images/child_icon.png" />';
							category.childs.push(sonCat._id);
							catsArr.push(sonCat);
						});
					}


				}
			});


			$scope.filteredCategories = catsArr;
		};

		$scope.rebuildFilteredTools = function(selectedLang, selectedCategory)
		{
			var toolsArr = [];

			angular.forEach($scope.tools, function (tool) {
				if (angular.isDefined(selectedCategory))
				{
					var relevantCats = $filter('filter')(tool.categories, function(value)
					{
						return value === selectedCategory._id || _.contains(selectedCategory.childs, value);
					});

					if (tool.language === $scope.selectedLang._id && relevantCats.length > 0) {
						toolsArr.push(tool);
					}
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

		$scope.addMissingCategory = function(category)
		{
			category = category || null;

			var modalInstance = $modal.open({
				templateUrl: 'views/add_missing_category.html',
				controller: 'AddMissingCategoryController',
				resolve: {
					category: function()
					{
						return category;
					},
					languages: function()
					{
						return $scope.languages;
					},
					languageId: function()
					{
						return $scope.selectedLang._id;
					},
					categories: function()
					{
						return $scope.categories;
					}
				}
			});

			modalInstance.result.then(function (createdObj) {
				if (category === null)
				{
					$scope.categories.push(createdObj);
				}
				else
				{
					angular.extend(category, createdObj);
				}

				$scope.rebuildFilteredCategories($scope.selectedLang);
			});
		};

		$scope.addMissingTool = function(baseObj)
		{
			baseObj = baseObj || {};

			var modalInstance = $modal.open({
				templateUrl: 'views/add_missing_tool.html',
				controller: 'AddMissingToolController',
				resolve: {
					languageId: function() {
						if (angular.isUndefined($scope.selectedLang)) {
							return null;
						}

						return $scope.selectedLang._id;
					},
					baseObj: function()
					{
						return baseObj;
					},
					languages: function()
					{
						return $scope.languages;
					},
					categoryId: function()
					{
						if (angular.isUndefined($scope.selectedCat)) {
							return null;
						}

						return $scope.selectedCat._id;
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
				controller: 'AddStackController',
				resolve: {
					tools: function()
					{
						return $scope.tools;
					},
					missingToolHandler: function()
					{
						return $scope.addMissingTool;
					}
				}
			});

			modalInstance.result.then(function (createdObj) {
				$scope.stacks.push(createdObj);
			});
		};

		$scope.getToolsCount = function(langs)
		{
			var total = 0;

			angular.forEach(langs, function(value)
			{
				if (angular.isDefined(value.tools))
				{
					total += value.tools.length;
				}
			});

			return total;
		};

		$scope.$watch('selectedStack', function(newValue)
		{
			if (angular.isDefined(newValue))
			{
				$scope.saveStack();
			}
		}, true);


        $scope.saveStack = function() {
			var stackObj = angular.copy($scope.selectedStack);
			delete stackObj._id;
			delete stackObj.createdBy;
			delete stackObj.updatedBy;
			delete stackObj.createdAt;
			delete stackObj.updatedAt;
			delete stackObj.__v;

			StacksService.edit($scope.selectedStack._id, stackObj);
        };
    }
]);