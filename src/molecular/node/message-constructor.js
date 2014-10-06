define(function defMessageObject(require, exports, module) {


	var subject = require('subject'),
		_       = require('lodash');



	var message = subject({

		initialize: function initializeMessage(options) {
			_.assign(this, options);
			this.propagate = true;
		},


		respond: function respond(response) {
			this.response = response;

			this.propagate = false;
		},
	});

	var broadcast = subject({

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

	module.exports = function buildMessageObject(type, options) {

		return type === 'broadcast' ? broadcast(options) : message(options);

	}

});
