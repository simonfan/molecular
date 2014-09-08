define(function defMolecularViewDirectiveSystem(require, exports, module) {

	require('es5-shim');

	var _ = require('lodash');

	/**
	 * DOM events directives.
	 */
	_.assign(exports, require('molecular/view/directives/dom-events'));

	/**
	 * [mView description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} value   [description]
	 * @return {[type]}         [description]
	 */
	exports.mView = function viewDirective(element, moduleName) {

		console.log(moduleName);

		var viewModule = require([moduleName], function (viewModule) {

			// instantiate
			var viewInstance = viewModule({ element: element });

			// add viewInstance
			this.addChildren(viewInstance);

		}.bind(this));
	};


});
