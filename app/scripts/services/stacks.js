'use strict';

showMyStackApp.service('StacksService', ['Restangular',
    function(Restangular) {
        var stackState = Restangular.all('stacks');

        this.add = function(stackObj) {
            return stackState.add(stackObj);
        };

        this.edit = function(stackId, stackObj) {
            return stackState.customPUT(stackObj, 'edit/' + stackId);
        };

        this.getAll = function() {
            return stackState.getAll();
        };

        this.getById = function(stackId) {
            return stackState.one('getById', stackId).get();
        };

		this.getByIdFull = function(stackId) {
			return stackState.one('getStack', stackId).get();
		};
    }
]);