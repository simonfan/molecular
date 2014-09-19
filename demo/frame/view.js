define(function defBaseFrameView(require, exports, module) {

	var view = require('molecular').view;

	var frameView = view.extend({
		template: require('text!demo/frame/layout.html'),

		visualize: function (dest) {
			alert('frame visualize navigate to ' + dest);
		}
	});

	module.exports = frameView;
});
