'use strict';

showMyStackApp.service('DataService', ['Restangular',
    function(Restangular) {
        var languagesState = Restangular.all('language');
        var frameworkState = Restangular.all('framework');
        var categoryState = Restangular.all('category');
        var extensionState = Restangular.all('extension');

        this.addLanguage = function(langObj) {
            return languagesState.add(langObj);
        };

        this.addFramework = function(frameworkObj) {
            return frameworkState.add(frameworkObj);
        };

        this.addCategory = function(catObj) {
            return categoryState.add(catObj);
        };

        this.addExtension = function(extObj) {
            return extensionState.add(extObj);
        };

        this.getAllLanguages = function() {
            return languagesState.getAll();
        };

        this.getAllExtensions = function() {
            return extensionState.getAll();
        };

        this.getAllCategories = function() {
            return categoryState.getAll();
        };

        this.getAllFrameworks = function() {
            return frameworkState.getAll();
        };

        this.getExtensionsByFrameworkAndLanguage = function(frameworkId, langId) {
            return extensionState.one('getByFramework', frameworkId).one('andLanguage', langId).get();
        };
    }
]);
