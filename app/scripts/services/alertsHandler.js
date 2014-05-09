'use strict';

showMyStackApp.service('AlertsHandlerService', ['$rootScope',
    function($rootScope) {
        var self = this;

        $rootScope.alerts = [];

        this.addError = function(message) {
            self.add(message, 'danger');
        };

        this.addInfo = function(message) {
            self.add(message, 'info');
        };

        this.addWarning = function(message) {
            self.add(message, 'warning');
        };

        this.addSuccess = function(message) {
            self.add(message, 'success');
        };

        this.add = function(message, type) {
            $rootScope.alerts.push({
                message: message,
                type: type
            });
        };

        this.getAlertsArray = function() {
            return $rootScope.alerts;
        };

        this.clear = function(index) {
            $rootScope.alerts.splice(index, 1);
        };

        this.clearAll = function() {
            $rootScope.alerts.splice(0, $rootScope.alerts.length);
        };
    }
]);
