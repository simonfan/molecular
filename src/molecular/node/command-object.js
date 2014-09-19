define(function defCommandSystem(require, exports, module) {

	require('es5-shim');

	var subject = require('subject');


	var baseCommand = subject({
		initialize: function initializeSingleResponseCommand(options) {

			this.name   = options.name;
			this.issuer = options.issuer;
			this.args   = options.args;

			this.propagate = true;

			/**
			 * Flag that defines whether the command has been answered
			 * @type {Boolean}
			 */
			this.answered = false;
		},

		/**
		 * Set propagate flag to false.
		 * @return {[type]} [description]
		 */
		stopPropagation: function stopPropagation() {
			this.propagate = false;
		},
	})


	/**
	 * Single response commands stop propagation on
	 * first call to 'respond' method.
	 *
	 */
	exports.singleResponse = baseCommand.extend({
		initialize: function initializeSingleResponseCommand(options) {

			baseCommand.prototype.initialize.call(this, options);

			/**
			 * Response is undefined.
			 * @type {[type]}
			 */
			this.response = void(0);
		},

		/**
		 * Set the response property then
		 * stop propagation.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		respond: function respond(value) {
			this.answered = true;

			this.response = value;
			this.stopPropagation();
		},
	});



	/**
	 * Multi response commands take several responses
	 * and do not stop propagation on 'respond' method calls.
	 */
	exports.multiResponse = baseCommand.extend({
		initialize: function initializeSingleResponseCommand(options) {

			baseCommand.prototype.initialize.call(this, options);
			/**
			 * Response should be an array.
			 * @type {Array}
			 */
			this.response = [];
		},

		/**
		 * Set the response property then
		 * stop propagation.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		respond: function respond(value) {

			this.answered = true;

			this.response.push(value);

			// do not stop propagation.
		}
	});


});
