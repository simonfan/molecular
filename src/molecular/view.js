define(function defMolecularView(require, exports, module) {

	var _ = require('lodash');

	var node = require('molecular/node'),
		aux  = require('molecular/auxiliary');


	/**
	 * Finds all elements that should be processed by a
	 * given directive given a rootElement and a directiveName
	 */
	function findDirectedElements(rootElement, directiveName) {
		var selector = '[data-' + aux.toDashed(directiveName) + ']';

		return rootElement.find(selector);
	}

	/**
	 * Define the viewFactory
	 */
	var viewFactory = node.extend({

		initialize: function initializeMolecularView(options) {

			node.prototype.initialize.call(this, options);

			/**
			 * Pick some options.
			 */
			aux.transfer([
				'element',

				'template',
				'render',
				'compileTemplate'
			], options, this);

			/**
			 * The adapted DOM element.
			 *
			 * @type {[type]}
			 */
			this.element = this.DOMElementAdapter(options.element);

			////////////
			// render //
			////////////
			this.render(options);

			///////////////////////////
			// initialize directives //
			///////////////////////////
			_.each(this.directives, function (directiveFn, directiveName) {
				// [1] find elements to be directed.
				var directedElements = findDirectedElements(this.element, directiveName);

				// [2] loop directed elements
				_.each(directedElements, function (element) {

					// [2.1] wrap and read data
					element = this.DOMElementAdapter(element);

					var directiveValue = element.data(directiveName);

					// [2.2] invoke directiveFn
					//       passing element and directive value.
					directiveFn.call(this, element, directiveValue)

				}.bind(this));

			}.bind(this));
		},

		/**
		 * Define directives.
		 * @type {[type]}
		 */
		directives: require('molecular/view/directives')
	});

	viewFactory
		.assignProto(require('molecular/view/dom-manipulation'))
		.assignProto(require('molecular/view/rendering'));

	/**
	 * Keep reference to the original extend method.
	 * @type {[type]}
	 */
	var _originalExtend = viewFactory.extend;
	// define new behaviour for extend.
	viewFactory.assignStatic('extend', function extendMolecularViewFactory(extensions, options) {
		extensions.directives = _.assign({}, this.prototype.directives, extensions.directives);

		return _originalExtend.call(this, extensions, options);
	});

	module.exports = viewFactory;

});
