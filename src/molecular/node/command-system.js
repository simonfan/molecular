define(function defMolecularViewRequestChain(require, exports, module) {

	require('es5-shim');

	var q = require('q');


	function __command_respondMulti(response) {
		this.response.push(response);
	}

	function __command_respondSingle(response) {
		this.response = response;
		this.finish();
	}

	function __command_stopPropagation() {
		this.propagate = false;
	}

	function __command_finish() {
		this.defer.resolve(this.response);
		this.stopPropagation();
	}

	/**
	 * Decorator pattern for building a command object.
	 *
	 * @param  {[type]} options        [description]
	 * @param  {[type]} propagation [description]
	 * @return {[type]}             [description]
	 */
	function _buildCommandObject(name, options) {


		var command = {};

		// set properties
		command.name    = name;
		command.issuer  = options.issuer;
		command.args    = options.args;

		// defer system
		var commandDefer = q.defer();
		command.defer   = commandDefer;
		command.promise = commandDefer.promise;


		// response system
		var type = options.type || 'single';
		if (type === 'multi') {
			// will run untill the last handler
			command.response = [];
			command.respond  = __command_respondMulti;

		} else if (type === 'single') {
			// will run untill the first handler.
			command.response = void(0);
			command.respond  = __command_respondSingle;
		}

		// propagation flags.
		command.propagate       = true;
		command.stopPropagation = __command_stopPropagation;
		command.finish          = __command_finish;

		return command;
	}

	function _handleCommand(handlers, command) {

		// [2] get first handlerObj from handlers array
		var handlerObj = handlers.shift();

		if (handlerObj) {

			// call the handle command on the handlerObj
			handlerObj.handleCommand(command);

			// if after the handle command
			// mehtod has been called,
			// the command is still set to propagate,
			// continue hangling it.
			if (command.propagate) {
				_handleCommand(handlers, command);
			}

		} else {

			// finish the command.
			command.finish();
		}
	}

	/**
	 * Commands go top->down in the chain.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}         [description]
	 */
	exports.issueCommand = function issueCommand(direction, name, type) {

		// build a command object
		var command = _buildCommandObject(name, {
			name  : name,
			type  : type,
			issuer: this,
			args  : _.toArray(arguments).slice(2),
		});


		// [1] find all handlers depending on direction
		var handlers;

		if (direction === 'descendants') {
			// toward descendants

			handlers = _.clone(this.getChildren());
			handlers.forEach(function (node) {
				handlers = handlers.concat(node.getChildren());
			});

		} else {
			// toward ancestors

			handlers = _.clone(this.getParents());
			handlers.forEach(function (node) {
				handlers = handlers.concat(node.getParents());
			});
		}

		// handle
		_handleCommand(handlers, command);

		// return the promise.
		return command.promise;
	};

	/**
	 * Requests go down->up in the chain.
	 *
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	exports.issueCommandUp   = _.partial(exports.issueCommand, 'ancestors');
	exports.issueCommandDown = _.partial(exports.issueCommand, 'descendants');



	/**
	 * Receives a command.
	 * @param  {[type]} command [description]
	 * @return {[type]}         [description]
	 */
	exports.handleCommand = function handleCommand(command) {
		if (_.isFunction(this[command.name]) {
			var res = this[command.name].apply(this, command.args);
			command.respond(res);
		}
	};
});
