define(function defMolecularViewRendering(require, exports, module) {

	require('es5-shim');

	var _ = require('lodash');

	exports.render = function render(options) {
		var template = this.template,
			html;

		if (template) {
			// only render if a template is available

			// parse out data from options
			var data = this.parseTemplateData(options);

			// if template is still a string, override it
			// with the compiled function
			if (_.isString(template)) {
				template = this.template = this.compileTemplate(template);
			}

			// run template
			html = template(data);

			// insert html
			this.element.html(html);
		}

		///////////////////////////
		// initialize directives //
		///////////////////////////
		this.incorporate(this.element);

		return this;
	};

	exports.parseTemplateData = function parseTemplateData(d) {
		return d;
	};

	/**
	 * Template defaults to undefined.
	 * @type {[type]}
	 */
	exports.template = void(0);

	/**
	 * Should return a function.
	 * @type {[type]}
	 */
	exports.compileTemplate = _.template;

});
