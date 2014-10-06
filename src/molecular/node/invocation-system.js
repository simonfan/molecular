define(function defInvocationSystem(require, exports, module) {

	var _ = require('lodash');

	//////////////////////////
	// invocation specific //
	//////////////////////////
	function _invoke(options, method) {

		// retrieve the arguments
		var args = Array.prototype.slice.call(arguments, 2);

		// build up the message.
		var message = {
			type     : 'invocation',
			direction: options.direction,
			method   : method,
			args     : args
		};

		return options.broadcast ?
			this.broadcastMessage(message) : this.sendMessage(message);
	};

	exports.invokeUpstream = _.partial(_invoke, {
		direction: 'upstream',
		broadcast: false,
	});

	exports.invokeDownstream = _.partial(_invoke, {
		direction: 'downstream',
		broadcast: false
	});

	exports.multiInvokeUpstream = _.partial(_invoke, {
		direction: 'upstream',
		broadcast: true,
	});

	exports.multiInvokeDownstream = _.partial(_invoke, {
		direction: 'downstream',
		broadcast: true
	});

});
