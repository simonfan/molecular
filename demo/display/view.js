define(function defDisplayView(require, exports, module) {

	var view = require('molecular').view;


	var displayView = view.extend({
		template: require('text!demo/display/layout.html'),
	});


	module.exports = displayView;
});
