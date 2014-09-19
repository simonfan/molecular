define(function defMolecularView(require, exports, module) {

	var _ = require('lodash'),
		$ = require('jquery');

	var node = require('molecular/node'),
		aux  = require('molecular/auxiliary');



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
			], options, this);

			/**
			 * The adapted DOM element.
			 *
			 * @type {[type]}
			 */
			this.element = $(options.element);

			////////////
			// render //
			////////////
			this.render(options);
		},
	});

	viewFactory
		.assignProto(require('molecular/view/dom-manipulation'))
		.assignProto(require('molecular/view/directives'))
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
