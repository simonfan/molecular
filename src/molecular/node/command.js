define(function defCommandSystem(require, exports, module) {


	var subject = require('subject');

	var singleResponseCommand = exports.singleResponse = subject({
		initialize: function initializeSingleResponseCommand(options) {

			this.name   = options.name;
			this.issuer = options.issuer;
			this.args   = options.args;

			this.propagate = true;

			this.response = void(0);
		},

		/**
		 * Set propagate flag to false.
		 * @return {[type]} [description]
		 */
		stopPropagation: function stopPropagation() {
			this.propagate = false;
		},

		/**
		 * Set the response property then
		 * stop propagation.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		respond: function respond(value) {
			this.response = value;
			this.stopPropagation();
		}
	});

	var multiResponseCommand = exports.multiResponse = subject({
		initialize: function initializeSingleResponseCommand(options) {

			this.name   = options.name;
			this.issuer = options.issuer;
			this.args   = options.args;

			this.propagate = true;

			/**
			 * Response should be an array.
			 * @type {Array}
			 */
			this.response = [];
		},

		/**
		 * Set propagate flag to false.
		 * @return {[type]} [description]
		 */
		stopPropagation: function stopPropagation() {
			this.propagate = false;
		},

		/**
		 * Set the response property then
		 * stop propagation.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		respond: function respond(value) {
			this.response.push(value);

			// do not stop propagation.
		}
	});


});
