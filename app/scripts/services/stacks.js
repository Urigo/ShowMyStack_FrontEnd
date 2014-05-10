'use strict';

showMyStackApp.service('StacksService', ['Restangular',
    function(Restangular) {
        var stackState = Restangular.all('stacks');

        this.add = function(stackObj) {
            return stackState.add(stackObj);
        };

        this.getAll = function() {
            return stackState.getAll();
        };
    }
]);
