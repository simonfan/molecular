define(function defMolecularNodeChannelSystem(require, exports, module) {

	require('es5-shim');

	/**
	 * Load command builders.
	 * @type {[type]}
	 */
	var command = require('molecular/node/command-object');



	/**
	 * Finds all upstream nodes of a given node.
	 * To be used privately in order to get ndoes to send commands upstream.
	 * @param  {[type]} node [description]
	 * @return {[type]}      [description]
	 */
	function _upstream(node) {

		// find all nodes depending on direction
		var nodes = _.clone(node.getParent());
		nodes.forEach(function (node) {
			nodes = nodes.concat(node.getParent());
		});

		return nodes;
	}

	/**
	 * Finds all the _downstream nodes of a given node.
	 * To be used privately in order to get nodes to sned commands downstream.
	 * @param  {[type]} node [description]
	 * @return {[type]}      [description]
	 */
	function _downstream(node) {
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
	 * Send the command towards a given direction.
	 *
	 * @param  {[type]} direction [description]
	 * @param  {[type]} name      [description]
	 * @return {[type]}           [description]
	 */
	exports.command = function command(direction, name) {
		// build a command object
		var cmd = command.singleResponse({
			name  : name,
			issuer: this,
			args  : _.toArray(arguments).slice(2)
		});

		// get the nodes through which the command should be channeled
		var nodes = (direction === 'upstream') ? _upstream(this) : _downstream(this);

		// channel the command through the nodes.
		return _channelCommand(nodes, cmd);
	};


	exports.broadcastCommand = function broadcastCommand(direction, name) {

		// [1] build a multi response command
		var cmd = command.multiResponse({
			name  : name,
			issuer: this,
			args  : _.toArray(arguments).slice(2)
		});

		// [2] get nodes through which th e command should be channedled
		var nodes = (direction === 'upstream') ? _upstream(this) : _downstream(this);

		// [3] channel
		return _channelCommand(nodes, cmd);
	}

	/**
	 * Issue command up the chain.
	 *
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	exports.commandUp = function commandUp(name) {

		// handle and return value
		return _channelCommand(_upstream(this), cmd);
	};
	exports.command = exports.commandUp;

	/**
	 * Issues command down the chain.
	 *
	 * @return {[type]} [description]
	 */
	exports.commandDown = function commandDown(name) {

		// build a command object
		var cmd = command.singleResponse({
			name  : name,
			issuer: this,
			args  : _.toArray(arguments).slice(1)
		});

		// channel and return result
		return _channelCommand(_downstream(this), cmd);
	};


	/**
	 * Sends a command up to be answered by multiple respondants.
	 *
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	exports.broadcastCommandUp = function broadcastCommandUp(name) {
		var cmd = command.multiResponse({
			name: name,
			issuer: this,
			args: _.toArray(arguments).slice(1)
		});

		return _channelCommand(_upstream(this), cmd);
	};
	exports.broadcastCommand = exports.broadcastCommandUp;

	/**
	 * Sends a command DOWNSTREAM to be answered by multiple respondants.
	 *
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	exports.broadcastCommandDown = function broadcastCommandDown(name) {
		var cmd = command.multiResponse({
			name: name,
			issuer: this,
			args: _.toArray(arguments).slice(1)
		});

		return _channelCommand(_downstream(this), cmd);
	};



	/**
	 * Receives a command.
	 * The default handler simply checks if the command.name
	 * is a method on the instance.
	 * If so, responds the command with the value returned by the execution
	 * of the method.
	 * Otherwise, simply ignore the command's existence and let it be passed onto
	 * other nodes.
	 *
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
