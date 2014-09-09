define(function defMolecularViewRequestChain(require, exports, module) {

	require('es5-shim');

	var q = require('q');





	/**
	 * Decorator pattern for building a command object.
	 *
	 * @param  {[type]} options        [description]
	 * @param  {[type]} propagation [description]
	 * @return {[type]}             [description]
	 */
	function _buildCommandObject(name, options) {

		// build a command object
		var command = q.defer();

		// set properties
		command.issuer  = this;
		command.name    = name;
		command.options = options;

		// propagation defaults to bubble.
		command.propagation = options.propagation || 'bubble';

		return command;
	}

	function commandResolverError(command) {
		var err = new Error([
			'[molecular/node/command-system]',
			'No resolver was found for "' + command.name + '"',
			'command.'
		].join(' '));

		return err;
	}






	//////////////////////
	// BUBBLING COMMAND //
	//////////////////////


	/**
	 * Bubbles a command up the chain.
	 * @param  {[type]} command [description]
	 * @return {[type]}         [description]
	 */
	function _bubbleCommand(handlerObj, command) {

		var parent = handlerObj.getParent();

		if (parent) {
			// let parent handle the command.
			_handleBubblingCommand(parent, command);

		} else {
			// no parent left, at root node
			// throw error
			command.reject(commandResolverError(command));
		}
	}

	function _handleBubblingCommand(handlerObj, command) {

		q.fcall(handlerObj.handleCommand.bind(handlerObj), command.name, command.options)
			.then(function (res) {
				command.resolve(res);

				return command.promise;
			}, function (err) {
				// handling failed
				_bubbleCommand(handlerObj, command);
			});
	}

	///////////////////////
	// CAPTURING COMMAND //
	///////////////////////

	/**
	 * Captures a command.
	 * @param  {[type]} command [description]
	 * @return {[type]}         [description]
	 */
	function _captureCommand(possibleHandlerObjs, command) {

		// [2] get first handlerObj from possibleHandlerObjs array
		var handlerObj = possibleHandlerObjs.shift();

		if (handlerObj) {

			_handleCapturingCommand(handlerObj, command, possibleHandlerObjs);

		} else {
			// no possibleHandlerObjs left,
			// throw error.
			command.reject(commandResolverError(command));
		}
	}

	function _handleCapturingCommand(handlerObj, command, possibleHandlerObjs) {

		// // attempt to handle the command on the current handlerObj
		// var handler = handlerObj.getCommandHandler(command.name, command.options);

		// if (handler) {

		// 	q.fcall(handler.bind(handlerObj), command.options)
		// 		.then(function (res) {
		// 			// resolve
		// 			command.resolve(res);
		// 			return command.promise;
		// 		}, function (err) {
		// 			// try next handlerObj

		// 			_captureCommand(possibleHandlerObjs, command);

		// 		});

		// } else {

		// 	_captureCommand(possibleHandlerObjs, command);

		// }


		q.fcall(handlerObj.handleCommand.bind(handlerObj), command.name, command.options)
			.then(function (res) {
				// resolve
				command.resolve(res);
				return command.promise;
			}, function (err) {
				// try next handlerObj
				_captureCommand(possibleHandlerObjs, command);
			});
	}


	/**
	 * Initialize a command.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}         [description]
	 */
	exports.issueCommand = function issueCommand(name, options) {

		// build a command object
		var command = _buildCommandObject(name, options);

		if (command.propagation === 'bubble') {
			// bubble up
			_bubbleCommand(this, command);

		} else {
			// capture

			// [1] find all possibleHandlerObjs
			var possibleHandlerObjs = _.clone(this.getChildren());

			possibleHandlerObjs.forEach(function (p) {
				possibleHandlerObjs = possibleHandlerObjs.concat(p.getChildren());
			});

			// capture
			_captureCommand(possibleHandlerObjs, command);
		}

		// return the promise.
		return command.promise;
	};

	/**
	 * Method that attempts to handle
	 * the command received.
	 *
	 * Throw errors in order to let the chain know the command
	 * was not successfully handled.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	exports.handleCommand = function handleCommand(name, options) {
		return this[name](options);
	};

	/**
	 * Method that retrieves the command handler given the command name
	 * and the command options.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	exports.getCommandHandler = function getCommandHandler(name, options) {

		var handlerFn = this[name];

		if (_.isFunction(handlerFn)) {
			return handlerFn;
		}
	};
});
