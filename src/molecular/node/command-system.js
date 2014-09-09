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

		var handlerFn = handlerObj.getCommandHandler(command.name, command.options);

		if (handlerFn) {

			q(handlerFn.call(handlerObj, command.options))
				.then(function (res) {

					command.resolve(res);

					return command.promise;

				}).fail(function (e) {
					// handling failed
					_bubbleCommand(handlerObj, command);
				}.bind(handlerObj));
		} else {


			_bubbleCommand(handlerObj, command);

		}
	}

	///////////////////////
	// CAPTURING COMMAND //
	///////////////////////

	/**
	 * Captures a command.
	 * @param  {[type]} command [description]
	 * @return {[type]}         [description]
	 */
	function _captureCommand(possibleCapturers, command) {

		// [2] get first possibility from possibleCapturers array
		var possibility = possibleCapturers.shift();

		if (possibility) {

			_handleCapturingCommand(possibility, command, possibleCapturers);

		} else {
			// no possibleCapturers left,
			// throw error.
			command.reject(commandResolverError(command));
		}
	}

	function _handleCapturingCommand(possibility, command, possibleCapturers) {

		// attempt to handle the command on the current possibility
		var handler = possibility.getCommandHandler(command.name, command.options);

		if (handler) {

			q(handler.call(possibility, command.options))
				.then(function (res) {
					// resolve
					command.resolve(res);
					return command.promise;
				})
				.fail(function (err) {
					// try next possibility

					_captureCommand(possibleCapturers, command);

				});

		} else {

			_captureCommand(possibleCapturers, command);

		}
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

			// [1] find all possibleCapturers
			var possibleCapturers = _.clone(this.getChildren());

			possibleCapturers.forEach(function (p) {
				possibleCapturers = possibleCapturers.concat(p.getChildren());
			});

			// capture
			_captureCommand(possibleCapturers, command);
		}

		// return the promise.
		return command.promise;
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
