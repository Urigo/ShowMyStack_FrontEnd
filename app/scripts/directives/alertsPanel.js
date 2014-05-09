'use strict';

showMyStackApp.directive('alertsPanel', ['AlertsHandlerService',
    function(AlertsHandlerService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                clearOnInit: '@'
            },
            template: '<div ng-repeat="alert in alertsArray" class="alert alert-{{alert.type}} alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="dismissAlert($index)">&times;</button>{{alert.message}}</div>',
            link: function(scope) {
                if (angular.isDefined(scope.clearOnInit) && scope.clearOnInit === 'true') {
                    AlertsHandlerService.clearAll();
                }

                scope.alertsArray = AlertsHandlerService.getAlertsArray();
                scope.dismissAlert = AlertsHandlerService.clear;
            }
        };
    }
]);
