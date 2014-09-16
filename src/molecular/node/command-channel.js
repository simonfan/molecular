define(function defMolecularNodeChannelSystem(require, exports, module) {

	require('es5-shim');

	/**
	 * Load command builders.
	 * @type {[type]}
	 */
	var command = require('molecular/node/command');



	function _ancestors(node) {

		// find all nodes depending on direction
		var nodes = _.clone(node.getParent());
		nodes.forEach(function (node) {
			nodes = nodes.concat(node.getParent());
		});

		return nodes;
	}


	function _descendants(node) {
		var nodes = _.clone(node.getChild());
		nodes.forEach(function (node) {
			nodes = nodes.concat(node.getChild());
		});

		return nodes;
	}

	/**
	 * Channels a command through an array of nodes
	 * @param  {[type]} nodes [description]
	 * @param  {[type]} command  [description]
	 * @return {[type]}          [description]
	 */
	function _channelCommand(nodes, command) {
		// [2] get first node from nodes array
		var node = nodes.shift();

		if (node) {

			// call the handle command on the node
			node.handleCommand(command);

			// if after the handle command
			// mehtod has been called,
			// the command is still set to propagate,
			// continue hangling it.
			if (command.propagate) {
				return _channelCommand(nodes, command);
			} else {
				return command.response;
			}

		} else {

			// return the response
			return command.response;
		}
	}

	/**
	 * Issue command up the chain.
	 *
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	exports.sendCommandUp = function sendCommandUp(name) {

		// build a command object
		var cmd = command.singleResponse({
			name  : name,
			issuer: this,
			args  : _.toArray(arguments).slice(1)
		});

		// handle and return value
		return _channelCommand(_ancestors(this), cmd);
	};
	exports.sendCommand = exports.sendCommandUp;

	/**
	 * Issues command down the chain.
	 *
	 * @return {[type]} [description]
	 */
	exports.sendCommandDown = function sendCommandDown(name) {

		// build a command object
		var cmd = command.singleResponse({
			name  : name,
			issuer: this,
			args  : _.toArray(arguments).slice(1)
		});

		// channel and return result
		return _channelCommand(_descendants(this), cmd);
	};


	exports.broadcastCommandUp = function broadcastCommandUp(name) {
		var cmd = command.multiResponse({
			name: name,
			issuer: this,
			args: _.toArray(arguments).slice(1)
		});

		return _channelCommand(_ancestors(this), cmd);
	};
	exports.broadcastCommand = exports.broadcastCommandUp;

	exports.broadcastCommandDown = function broadcastCommandDown(name) {
		var cmd = command.multiResponse({
			name: name,
			issuer: this,
			args: _.toArray(arguments).slice(1)
		});

		return _channelCommand(_descendants(this), cmd);
	};



	/**
	 * Receives a command.
	 * @param  {[type]} command [description]
	 * @return {[type]}         [description]
	 */
	exports.handleCommand = function handleCommand(command) {
		if (_.isFunction(this[command.name])) {
			var res = this[command.name].apply(this, command.args);
			command.respond(res);
		}
	};
});
