define(function defDemoApp(require, exports, module) {


	var molecular = require('molecular'),
		view      = molecular.view;


	module.exports = view.extend({
		visualize: function (visId) {
			alert('visualize ' + visId);
		},

		/**
		 * Override 'handleCommand' method in order to
		 * throw errors if the command did not get ANY response.
		 */
		handleCommand: function handleCommand(command) {

			view.prototype.handleCommand.call(this, command);

			// if the command has not been answered, throw error
			if (!command.answered) {
				throw new Error('Command ' + command.name + ' has not been answered.');
			}
		}
	});

});
