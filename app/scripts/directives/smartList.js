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
			events: '='
		},
		replace: true,
		transclude: true,
		template: '<ul class="list-group checked-list-box" ng-transclude=""></ul>',
		controller: function ($scope) {
			this.items = $scope.selectedModel || {};
			this.singleSelectionMode = false;
			this.styles = angular.extend({classSelected: 'list-group-item-info active', classNotSelected: '', classLastClickedItem: 'list-group-item-primary'}, $scope.styles);
			this.events = angular.extend({lastClickedChanged: angular.noop, itemAddedToSelection: angular.noop, itemRemovedFromSelection: angular.noop}, $scope.events);

			if ($scope.maxSelected === '1')
			{
				this.singleSelectionMode = true;
			}

			this.getStyles = function()
			{
				return this.styles;
			};

			this.setLastItemClicked = function(item)
			{
				if (!item.nonClickable)
				{
					this.events.lastClickedChanged(item.obj);

					if (angular.isDefined(this.lastClickedItem))
					{
						this.lastClickedItem.lastClicked = false;
					}

					item.lastClicked = true;
					this.lastClickedItem = item;
				}

			};

			this.toggleSelectionItem = function(smartListItem)
			{
				if (smartListItem.isCheckbox)
				{
					if (angular.isUndefined(this.items[smartListItem.id]))
					{
						this.events.itemAddedToSelection(smartListItem);

						if (this.singleSelectionMode && angular.isDefined(this.lastSelected))
						{
							this.toggleSelectionItem(this.lastSelected);
						}

						this.items[smartListItem.id] = smartListItem.obj;
						this.lastSelected = smartListItem;
						smartListItem.isSelected = true;
					}
					else
					{
						this.events.itemRemovedFromSelection(smartListItem);

						smartListItem.isSelected = false;
						delete this.items[smartListItem.id];
					}
				}
			};
		}
	};
}]);

showMyStackApp.directive('smartListItem', ['$document', '$filter', function($document, $filter) {
	return {
		restrict: 'EA',
		scope: {
			itemValue: '=',
			itemIdProp: '@',
			itemCheckbox: '@',
			nonClickable: '@'
		},
		replace: true,
		transclude: true,
		template: '<li ng-click="itemClick()" class="list-group-item" ng-class="currentItem.lastClicked ? styles.classLastClickedItem : (currentItem.isSelected ? styles.classSelected : styles.classNotSelected)">' +
			'<div class="row"><div ng-show="currentItem.isCheckbox" class="col-md-2 right-seperator" ng-click="toggleSelection($event)">' +
			'<span class="glyphicon" ng-class="{\'glyphicon-check\': currentItem.isSelected, \'glyphicon-unchecked\': !currentItem.isSelected}"></span>' +
			'</div>' +
			'<div class="col-md-10" ng-transclude>' +
			'</div>' +
			'</div>' +
			'</li>',
		require: '^smartList',
		link: function (scope, elem, attrs, smartListInstance) {
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

			scope.itemClick = function()
			{
				smartListInstance.setLastItemClicked(scope.currentItem);

			};

			scope.toggleSelection = function($event)
			{
				smartListInstance.toggleSelectionItem(scope.currentItem);
				$event.stopImmediatePropagation();
			};

			scope.currentItem = {
				nonClickable: angular.isDefined(scope.nonClickable) ? true : false,
				isCheckbox: angular.isDefined(scope.itemCheckbox) ? true : false,
				lastClicked: false,
				isSelected: false,
				obj: scope.itemValue,
				id: scope.getItemId(scope.itemValue, scope.itemIdProp)};
		}
	};
}]);