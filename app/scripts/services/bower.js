'use strict';

showMyStackApp.service('BowerService', ['Restangular',
	function(Restangular) {
		var packagesBase = Restangular.all('bower');

		this.getBowerPackageInfo = function(packageName)
		{
			return packagesBase.one(packageName).get();
		};
	}
]);
