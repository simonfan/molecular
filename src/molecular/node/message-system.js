define(function defMolecularNodeChannelSystem(require, exports, module) {

	require('es5-shim');


	var messageConstructor = require('molecular/node/message-constructor');

	/**
	 * Sends the message upstream
	 *
	 * @param  {[type]} message    [description]
	 * @param  {[type]} sender     [description]
	 * @param  {[type]} recipients [description]
	 * @return {[type]}            [description]
	 */
	function _sendUpstream(sender, message, recipients) {

		// if no recipients are defined, get the upstream
		recipients = recipients || [sender];

		// get first recipient
		var recipient = recipients.shift();

		if (!recipient) {
			// if no recipient, return the response
			return message.response;

		} else {

			// let recipient receive the message
			_receiveMessage(recipient, message);

			if (message.propagate) {
				// propagate

				recipients = recipient.getUpstream().concat(recipients);
				// GO RECURSIVE
				return _sendUpstream(sender, message, recipients);
			} else {
				return message.response;
			}

		}
	}

	/**
	 * Send message downstream.
	 *
	 * @param  {[type]} message    [description]
	 * @param  {[type]} sender     [description]
	 * @param  {[type]} recipients [description]
	 * @return {[type]}            [description]
	 */
	function _sendDownstream(sender, message, recipients) {

		// if no recipients are defined, get the downstream
		recipients = recipients || sender.getDownstream();

		// get first recipient
		var recipient = recipients.shift();

		if (!recipient) {
			// no recipient, return the response
			return message.response;

		} else {
			// let recipient receive the message
			_receiveMessage(recipient, message);

			if (message.propagate) {
				// propagate
				recipients = recipient.getDownstream().concat(recipients);

				// GO RECURSIVE
				return _sendDownstream(sender, message, recipients);
			} else {
				return message.response;
			}
		}
	}



	function _receiveMessage(recipient, message) {

		if (!message.type) {
			throw new Error('No message type set.');
		}

		// retrieve recipient fn
		var recipientFn = recipient.messageReceivers[message.type];

		// call the recipientFn on the recipient
		recipientFn.call(recipient, message);
	}





	/**
	 * Sends a message.
	 * @param  {[type]} options [description]
	 * @return {[type]}                [description]
	 */
	exports.sendMessage = function sendMessage(options) {

		// set sender
		options.sender = this;

		var message = messageConstructor('message', options);

		return options.direction === 'downstream' ?
			_sendDownstream(this, message) : _sendUpstream(this, message);
	};

	exports.broadcastMessage = function broadcastMessage(options) {

		options.sender = this;

		var message = messageConstructor('broadcast', options);

		return options.direction === 'downstream' ?
			_sendDownstream(this, message) : _sendUpstream(this, message);
	};

	/**
	 * Message recipients.
	 * @type {Object}
	 */
	exports.messageReceivers = {
		invocation: function receiveInvocation(message) {

			// attempt to
			var fn = this[message.method];

			if (fn) {

				// if the invoked method is available on this instance
				// invoke it and respond the message with
				// whatever it returns.
				var response = fn.apply(this, message.args);

				// invoke the respond method.
				message.respond(response);
			}
		},
	};

	// event specific
	exports.emit = function emit(event, data) {

	};
});
