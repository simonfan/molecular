define(function defMolecularViewDOM(require, exports, module) {



	exports.html = function html() {
		this.element.html.apply(this.element, _.toArray(arguments));
	};

	exports.css = function css() {
		this.element.css.apply(this.element, _.toArray(arguments));
	};


});
