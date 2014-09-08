define(function defMolecularViewRequestChain(require, exports, module) {

	var q = require('q');


	/**
	 * Builds a request object to be passed on.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}         [description]
	 */
	exports.buildRequestObject = function buildRequestObject(name, data) {

		var request = q.defer();

		// set data
		request.data = data;

		return request;
	};

	/**
	 * Initialize a request.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}         [description]
	 */
	exports.issueRequest = function issueRequest(name, data) {

		// build a request object
		var request = this.buildRequestObject(name, data);

		// process the request.
		this.processRequest(name, request);


		return request.promise;
	};


	/**
	 * Attempts to handle a request.
	 * Checks if the current object can handle the request by
	 * calling `canHandleRequest`.
	 *
	 * If is able of resolving the request,
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} request [description]
	 * @return {[type]}         [description]
	 */
	exports.processRequest = function processRequest(name, request) {

		if (this.canHandleRequest(name, request)) {
			// can handle
			this.handleRequest(name, request);
		} else {
			// cannot handle

			// attempt to retrieve the parent object and let
			// the parent process the request.
			var parent = this.getParent();
			if (parent) {
				// let parent processRequest
				parent.processRequest(name, request);

			} else {
				// reject, as no resolver was found
				// and this object is root.
				request.reject(new Error('No resolver for ' + name + ' was found.'));
			}
		}
	};

	/**
	 * Request handling.
	 *
	 * This method is called once the `canHandleRequest` responds true for
	 * a given request.
	 */
	exports.handleRequest = function handleRequest(name, request) {

		var res = this[name](request.data);


		request.resolve(res);
	};

	/**
	 * Synchronous.
	 *
	 * Verifies if the current object is capable of handling a given request.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} request [description]
	 * @return {[type]}         [description]
	 */
	exports.canHandleRequest = function canHandleRequest(name, request) {
		return _.isFunction(this[name]);
	};

});
