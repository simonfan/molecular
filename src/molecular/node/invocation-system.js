define(function defMolecularNodeChannelSystem(require, exports, module) {

	require('es5-shim');

	var subject = require('subject');

	////////////////////
	// MESSAGE OBJECT //
	////////////////////
	var _invocationObject = subject({

		initialize: function initializeInvocationObject(options) {
			_.assign(this, options);
			this.propagate = true;
		},


		respond: function respond(response) {
			this.response = response;

			this.propagate = false;
		},
	});

	var _broadcastInvocationObject = subject({

		initialize: function initializeMultiInvocationObject(options) {

			_.assign(this, options);
			this.propagate = true;

			// response is an array.
			this.response = [];
		},

		respond: function respond(response) {
			this.response.push(response);
		}
	});
	////////////////////
	// MESSAGE OBJECT //
	////////////////////

	/**
	 * Sends the invocation upstream
	 *
	 * @param  {[type]} invocation    [description]
	 * @param  {[type]} sender     [description]
	 * @param  {[type]} recipients [description]
	 * @return {[type]}            [description]
	 */
	function _sendUpstream(sender, invocation, recipients) {

		// if no recipients are defined, get the upstream
		recipients = recipients || [sender];

		// get first recipient
		var recipient = recipients.shift();

		if (!recipient) {
			// if no recipient, return the response
			return invocation.response;

		} else {

			// let recipient receive the invocation
			recipient.receiveInvocation(invocation);

			if (invocation.propagate) {
				// propagate

				recipients = recipient.getUpstream().concat(recipients);
				// GO RECURSIVE
				return _sendUpstream(sender, invocation, recipients);
			} else {
				return invocation.response;
			}

		}
	}

	/**
	 * Send invocation downstream.
	 *
	 * @param  {[type]} invocation    [description]
	 * @param  {[type]} sender     [description]
	 * @param  {[type]} recipients [description]
	 * @return {[type]}            [description]
	 */
	function _sendDownstream(sender, invocation, recipients) {

		// if no recipients are defined, get the downstream
		recipients = recipients || sender.getDownstream();

		// get first recipient
		var recipient = recipients.shift();

		if (!recipient) {
			// no recipient, return the response
			return invocation.response;

		} else {
			// let recipient receive the invocation
			recipient.receiveInvocation(invocation);

			if (invocation.propagate) {
				// propagate
				recipients = recipient.getDownstream().concat(recipients);

				// GO RECURSIVE
				return _sendDownstream(sender, invocation, recipients);
			} else {
				return invocation.response;
			}
		}
	}




	/**
	 * Sends a invocation.
	 * @param  {[type]} options [description]
	 * @return {[type]}                [description]
	 */
	exports.sendInvocationUp = function sendInvocationUp(method) {

		var invocation = _invocationObject({
			sender: this,
			method: method,
			args:   Array.prototype.slice.call(arguments, 1),
		});

		return _sendUpstream(this, invocation);
	};

	/**
	 * [sendInvocationDown description]
	 * @param  {[type]} method [description]
	 * @return {[type]}        [description]
	 */
	exports.sendInvocationDown = function sendInvocationDown(method) {

		var invocation = _invocationObject({
			sender: this,
			method: method,
			args:   Array.prototype.slice.call(arguments, 1),
		});

		return _sendDownstream(this, invocation);
	};

	/**
	 * [broadcastInvocationUp description]
	 * @param  {[type]} method [description]
	 * @return {[type]}        [description]
	 */
	exports.broadcastInvocationUp = function broadcastInvocationUp(method) {

		var invocation = _broadcastInvocationObject({
			sender: this,
			method: method,
			args:   Array.prototype.slice.call(arguments, 1),
		});

		return _sendUpstream(this, invocation);
	};

	/**
	 * [broadcastInvocationDown description]
	 * @param  {[type]} method [description]
	 * @return {[type]}        [description]
	 */
	exports.broadcastInvocationDown = function broadcastInvocationDown(method) {

		var invocation = _broadcastInvocationObject({
			sender: this,
			method: method,
			args:   Array.prototype.slice.call(arguments, 1),
		});

		return _sendDownstream(this, invocation);
	};

	/**
	 * Method that effectivelly receives the invocation.
	 * 
	 * @param  {[type]} invocation
	 * @return {[type]}
	 */
	exports.receiveInvocation = function receiveInvocation(invocation) {

		// attempt to
		var fn = this[invocation.method];

		if (fn) {

			// if the invoked method is available on this instance
			// invoke it and respond the invocation with
			// whatever it returns.
			var response = fn.apply(this, invocation.args);

			// invoke the respond method.
			invocation.respond(response);
		}
	};
});
