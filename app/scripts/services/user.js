'use strict';

showMyStackApp.service('User', ['$localStorage', 'Restangular',

    function($localStorage, Restangular) {
        this.$storage = $localStorage;
        this.$storage.userDetails;
        this.alerts = [];

        var usersState = Restangular.all('users');

        this.getAuthToken = function() {
            if (angular.isDefined(this.$storage.userDetails) && angular.isDefined(this.$storage.userDetails.authToken)) {
                return this.$storage.userDetails.authToken;
            }

            return '';
        };

        this.getUserProfile = function() {
            return usersState.getMyProfile();
        };

        this.getUser = function() {
            return this.$storage.userDetails;
        };

        this.setUserFromResponse = function(userDetails) {
            this.$storage.userDetails = {};
            this.$storage.userDetails.user = userDetails.user;
            this.$storage.userDetails.authToken = userDetails.access_token;
            this.$storage.userDetails.isLoggedIn = true;
        };

        this.clearUser = function() {
            delete this.$storage.userDetails;
            this.$storage.userDetails;
        };

        this.isAuthenticated = function() {
            return angular.isDefined(this.$storage.userDetails) && this.$storage.userDetails !== null;
        };

        this.getEmail = function() {
            return this.$storage.userDetails.user.email;
        };
    }
]);
