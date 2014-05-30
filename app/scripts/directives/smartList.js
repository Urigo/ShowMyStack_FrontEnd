'use strict';

/**
 * Created by dotansimha on 5/15/14.
 */

showMyStackApp.directive('smartList', ['$filter', '$document', '$compile', function ($filter, $document, $compile) {
	return {
		restrict: 'AE',
		scope:{
			checkedModel: '=',
			options: '=',
			extraSettings: '=',
			events: '='
		},
		transclude: true,
		template: function(element, attrs)
		{
			var template = '';
			template += '<ul class="list-group">';
			template += '<li class="list-group-item" ng-class="{\'list-group-item-info\': lastClickedId === getPropertyForObject(option,settings.idProp)}" data-ng-repeat="option in options">' +
				'<div class="row">' +
				'<div class="col-md-2" ng-show="settings.checkables" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))" data-ng-class="{\'glyphicon glyphicon-unchecked\': !isChecked(getPropertyForObject(option,settings.idProp)),  \'glyphicon glyphicon-check\': isChecked(getPropertyForObject(option,settings.idProp))}"></div>' +
				'<div class="cursor-pointer" ng-class="{\'col-md-10\' : settings.checkables, \'col-md-12\': !settings.checkables}" ng-click="itemClick(getPropertyForObject(option,settings.idProp))">' +
				'{{getPropertyForObject(option, settings.displayProp)}}' +
				'</div>' +
				'</div>' +
				'<div ng-transclude>' +
				'</div>' +
				'</li>';

			template += '</ul>';
			template += '</div>';

			element.html(template);
		},
		link: function($scope, $element, $attrs){
			$scope.checkedModel = $scope.checkedModel || [];
			$scope.lastClickedId = undefined;

			$scope.eventsCallbacks = {itemClicked: angular.noop, itemChecked: angular.noop, itemUnchecked: angular.noop};
			$scope.eventsCallbacks = angular.extend($scope.eventsCallbacks, $scope.events || {});

			$scope.settings = {
				displayProp: 'label',
				idProp: 'id',
				externalIdProp: 'id',
				checkables: true,
				uncheckItemOnClick: true,
				enableSearch: true};

			angular.extend($scope.settings, $scope.extraSettings || []);

			function getFindObj(id)
			{
				var findObj = {};

				if ($scope.settings.externalIdProp === '')
				{
					findObj[$scope.settings.idProp] = id;
				}
				else {
					findObj[$scope.settings.externalIdProp] = id;
				}

				return findObj;
			}

			$scope.getPropertyForObject = function(object, property)
			{
				if (object.hasOwnProperty(property)) {
					return object[property];
				}

				return '';
			};

			$scope.itemClick = function(id)
			{
				$scope.setSelectedItem(id, $scope.settings.uncheckItemOnClick);

				var findObj = {};
				findObj[$scope.settings.idProp] = id;

				$scope.eventsCallbacks.itemClicked(_.find($scope.options, findObj));
				$scope.lastClickedId = id;
			};

			$scope.setSelectedItem = function(id, dontRemove){
				dontRemove = dontRemove || false;
				var findObj = getFindObj(id);

				if ($scope.settings.checkables)
				{
					var exists = _.findIndex($scope.checkedModel, findObj) !== -1;

					if (!dontRemove && exists) {
						$scope.checkedModel.splice(_.findIndex($scope.checkedModel, findObj), 1);
					} else if (!exists) {
						if ($scope.settings.externalIdProp === '')
						{
							var fullObjFind = getFindObj(id);
							var fullObj = _.find($scope.options, fullObjFind);
							$scope.checkedModel.push(fullObj);
						}
						else
						{
							$scope.checkedModel.push(findObj);
						}

					}
				}
			};

			$scope.getModelForObject = function (id) {
				return _.find($scope.checkedModel, getFindObj(id));
			};

			$scope.isChecked = function (id) {
				if (_.findIndex($scope.checkedModel, getFindObj(id)) !== -1) {
					return true;
				}

				return false;
			};
		}
	};
}]);