define(function defMolecularNodeChannelSystem(require, exports, module) {

	require('es5-shim');

	var subject = require('subject');

	////////////////////
	// MESSAGE OBJECT //
	////////////////////
	var _singleMessageObject = subject({

		initialize: function initializeMessage(options) {
			_.assign(this, options);
			this.propagate = true;
		},


		respond: function respond(response) {
			this.response = response;

			this.propagate = false;
		},
	});

	var _broadcastMessageObject = subject({

		initialize: function initializeBroadcastMessage(options) {

			_.assign(this, options);
			this.propagate = true;

			// response is an array.
			this.response = [];
		},

		respond: function respond(response) {
			this.response.push(response);
		}
	});

	function _buildMessageObject(type, options) {

		return type === 'broadcast' ? _broadcastMessageObject(options) : _singleMessageObject(options);

	}
	////////////////////
	// MESSAGE OBJECT //
	////////////////////

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
			recipient.receiveMessage(message);

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
			recipient.receiveMessage(message);

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




	/**
	 * Sends a message.
	 * @param  {[type]} options [description]
	 * @return {[type]}                [description]
	 */
	exports.sendMessage = function sendMessage(options) {

		// set sender
		options.sender = this;

		var message = _buildMessageObject('message', options);

		return options.direction === 'downstream' ?
			_sendDownstream(this, message) : _sendUpstream(this, message);
	};

	exports.broadcastMessage = function broadcastMessage(options) {

		options.sender = this;

		var message = _buildMessageObject('broadcast', options);

		return options.direction === 'downstream' ?
			_sendDownstream(this, message) : _sendUpstream(this, message);
	};

	/**
	 * Method that effectivelly receives the message.
	 * 
	 * @param  {[type]} message
	 * @return {[type]}
	 */
	exports.receiveMessage = function receiveMessage(message) {


		if (!message.type) {
			throw new Error('No message type set.');
		}

		// retrieve this fn
		var recipientFn = this.messageReceivers[message.type];

		// call the recipientFn on the recipient
		recipientFn.call(this, message);
	};

	/**
	 * Hash that holds all the message receivers.
	 * 
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

		'event': function receiveEvent(message) {
			
		},
	};
});
