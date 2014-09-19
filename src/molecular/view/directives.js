define(function defMolecularViewDirectiveSystem(require, exports, module) {

	require('es5-shim');

	var _ = require('lodash');

	var aux = require('molecular/auxiliary');

	/**
	 * Hash that holds all directive processors.
	 *
	 * @type {Object}
	 */
	var directives = {};


	/**
	 * [mView description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} value   [description]
	 * @return {[type]}         [description]
	 */
	directives.mView = function viewDirective(element, moduleName) {

		var viewModule = require([moduleName], function (viewModule) {

			// instantiate
			var viewInstance = viewModule({ element: element });

			// add viewInstance
			this.addChild(viewInstance);

		}.bind(this));
	};


	/**
	 * DOM events directives.
	 */
	_.assign(directives, require('molecular/view/directives/dom-events'));


	/**
	 * Reference to directives
	 * @type {[type]}
	 */
	exports.directives = directives;



	/**
	 * Finds all elements that should be processed by a
	 * given directive given a rootElement and a directiveName
	 */
	function findDirectedElements(rootElement, directiveName) {
		var selector = '[data-' + aux.toDashed(directiveName) + ']';

		return $(rootElement).find(selector);
	}


	/**
	 * Incorporates an element to the
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	exports.incorporate = function incorporate(element) {
		_.each(this.directives, function (directiveFn, directiveName) {
			// [1] find elements to be directed.
			var directedElements = findDirectedElements(element, directiveName);

			// [2] loop directed elements
			_.each(directedElements, function (element) {

				// [2.1] wrap and read data
				element = $(element);

				var directiveValue = element.data(directiveName);

				// [2.2] invoke directiveFn
				//       passing element and directive value.
				directiveFn.call(this, element, directiveValue)

			}.bind(this));

		}.bind(this));

		return this;
	};

});
