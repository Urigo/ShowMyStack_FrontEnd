'use strict';

showMyStackApp.service('DataService', ['Restangular',
    function(Restangular) {
        var languagesState = Restangular.all('language');
        var categoryState = Restangular.all('category');
        var toolState = Restangular.all('tool');

        this.addLanguage = function(langObj) {
            return languagesState.add(langObj);
        };

        this.addCategory = function(catObj) {
            return categoryState.add(catObj);
        };

        this.editCategory = function(id, catObj) {
			return categoryState.customPUT(catObj, 'edit/' + id);
        };

        this.addTool = function(toolObj) {
            return toolState.add(toolObj);
        };

        this.getAllLanguages = function() {
            return languagesState.getAll();
        };

        this.getAllTools = function() {
            return toolState.getAll();
        };

        this.getAllCategories = function() {
            return categoryState.getAll();
        };
    }
]);
