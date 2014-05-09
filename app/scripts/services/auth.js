'use strict';

showMyStackApp.service('AuthService', ['Restangular', 'User',
    function(Restangular, User) {
        var authState = Restangular.all('auth');

        this.register = function(userObj) {
            return authState.register(userObj);
        };

        this.login = function(userObj) {
            var loginPromise = authState.login(userObj);

            loginPromise.then(function(response) {
                User.setUserFromResponse(response);
            });

            return loginPromise;
        };
    }
]);
