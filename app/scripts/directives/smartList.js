'use strict';

/**
 * Created by dotansimha on 5/15/14.
 */
showMyStackApp.directive('smartList', ['$filter', function($filter) {
	return {
		restrict: 'EA',
		scope: {
			selectedModel: '=',
			maxSelected: '@',
			styles: '=',
			events: '=',
			externalModelProp: '@'
		},
		replace: true,
		transclude: true,
		template: '<ul ng-click="handleClickEvent($event)" class="list-group checked-list-box" ng-transclude=""></ul>',
		controller: ['$scope', function ($scope) {
			this.items = $scope.selectedModel || {};
			this.registeredItems = {};
			this.singleSelectionMode = false;
			this.styles = angular.extend({classSelected: 'list-group-item-info active', classNotSelected: '', classLastClickedItem: 'list-group-item-primary'}, $scope.styles);
			this.events = angular.extend({initDone: angular.noop, lastClickedChanged: angular.noop, itemAddedToSelection: angular.noop, itemRemovedFromSelection: angular.noop}, $scope.events);

			$scope.handleClickEvent = function($event)
			{
				$event.stopImmediatePropagation();
			};

			if ($scope.maxSelected === '1')
			{
				this.singleSelectionMode = true;
			}

			this.registerItem = function(itemId, smartListItemObj)
			{
				this.registeredItems[itemId] = smartListItemObj;
			};

			this.getRegisteredItem = function(itemId)
			{
				return this.registeredItems[itemId];
			};

			this.getStyles = function()
			{
				return this.styles;
			};

			this.setLastItemClicked = function(item)
			{
				if (!item.nonClickable)
				{
					var response = this.events.lastClickedChanged(item, this);

					if (angular.isDefined(this.lastClickedItem))
					{
						this.lastClickedItem.lastClicked = false;
					}

					item.lastClicked = true;
					this.lastClickedItem = item;

					return response;
				}
			};

			this.toggleSelectionItem = function(smartListItem)
			{
				if (smartListItem.isCheckbox)
				{
					if (angular.isUndefined(this.items[smartListItem.id]))
					{
						this.events.itemAddedToSelection(smartListItem, this);

						if (this.singleSelectionMode && angular.isDefined(this.lastSelected))
						{
							this.toggleSelectionItem(this.lastSelected);
						}

						if (angular.isDefined($scope.externalModelProp))
						{
							var externalObj = {};
							externalObj[$scope.externalModelProp] = smartListItem.id;
							this.items[smartListItem.id] = externalObj;
						}
						else
						{
							this.items[smartListItem.id] = smartListItem.obj;
						}

						this.lastSelected = smartListItem;
						smartListItem.isSelected = true;
					}
					else
					{
						this.events.itemRemovedFromSelection(smartListItem, this);

						smartListItem.isSelected = false;
						delete this.items[smartListItem.id];
					}
				}
			};

			this.events.initDone(this);
		}]
	};
}]);

showMyStackApp.directive('smartListItemHeader', [function()
{
	return {
		restrict: 'EA',
		replace: true,
		scope: false,
		transclude: true,
		template: '<div class="row">' +
			'<div ng-show="$$prevSibling.currentItem.isCheckbox" class="col-md-2 right-seperator" ng-click="$$prevSibling.toggleSelection($event)">' +
				'<span class="glyphicon" ng-class="{\'glyphicon-check\': $$prevSibling.currentItem.isSelected, \'glyphicon-unchecked\': !$$prevSibling.currentItem.isSelected}"></span>' +
			'</div>' +
			'<div class="col-md-10" ng-transclude></div>' +
			'</div>',
		require: '^smartListItem',
		link: function(scope, elem, attrs, smartListItemInstance) {
		}
	};
}]);

showMyStackApp.directive('smartListItemBody', [function()
{
	return {
		restrict: 'EA',
		replace: true,
		scope: false,
		transclude: true,
		template: '<div ng-show="$$prevSibling.currentItem.lastClicked" class="row smart-list-item-body"><div class="col-md-12" ng-transclude></div>',
		require: '^smartListItem',
		link: function(scope, elem, attrs, smartListItemInstance) {

		}
	};
}]);

showMyStackApp.directive('smartListItem', [function() {
	return {
		restrict: 'EA',
		scope: {
			itemValue: '=',
			itemIdProp: '@',
			itemCheckbox: '@',
			nonClickable: '@',
			itemSelectOnClick: '@'
		},
		replace: true,
		transclude: true,
		template: '<li ng-click="itemClick($event)" ng-transclude class="list-group-item" ng-class="currentItem.lastClicked ? styles.classLastClickedItem : (currentItem.isSelected ? styles.classSelected : styles.classNotSelected)">' +
			'</li>',
		require: '^smartList',
		controller: ['$scope', function($scope)
		{

		}],
		link: function (scope, elem, attrs, smartListInstance) {
			scope.smartListInstance = smartListInstance;
			scope.styles = smartListInstance.getStyles();

			scope.getItemId = function(itemValue, itemIdProp)
			{
				if (angular.isDefined(scope.nonClickable))
				{
					return 'non-clickable';
				}

				if (itemValue.hasOwnProperty(itemIdProp))
				{
					return itemValue[itemIdProp];
				}

				return '';
			};

			scope.itemClick = function($event)
			{
				$event.stopImmediatePropagation();

				if ($event.originalEvent.target.classList[0] !== 'form-control') {
					var response = smartListInstance.setLastItemClicked(scope.currentItem);

					if (angular.isUndefined(response) || response)
					{
						if (scope.currentItem.itemSelectOnClick) {
							scope.toggleSelection();
						}
					}
				}
			};

			scope.toggleSelection = function($event)
			{
				smartListInstance.toggleSelectionItem(scope.currentItem);

				if (angular.isDefined($event))
				{
					$event.stopImmediatePropagation();
				}

			};

			scope.currentItem = {
				nonClickable: angular.isDefined(scope.nonClickable) ? true : false,
				isCheckbox: angular.isDefined(scope.itemCheckbox) ? true : false,
				lastClicked: false,
				isSelected: false,
				itemSelectOnClick: angular.isDefined(scope.itemSelectOnClick) ? true : false,
				obj: scope.itemValue,
				id: scope.getItemId(scope.itemValue, scope.itemIdProp)};

			smartListInstance.registerItem(scope.currentItem.id, scope.currentItem);
		}
	};
}]);