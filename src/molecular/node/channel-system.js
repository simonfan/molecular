define(function defNodeTreeManagement(require, exports, module) {

	// load es5-shim
	require('es5-shim');

	/////////////////////////
	/// PARENT MANAGEMENT ///
	/////////////////////////
	exports.addUpstream = function addUpstream(node) {
		if (Array.isArray(node)) {
			// if it is an array of nodes, add them all
			node.forEach(this.addUpstream.bind(this));
		} else {

			// ignore addition if the node is already listed as
			// one of the instance's sources.
			if (!this.isUpstream(node)) {

				// push into array
				this.upstreamNodes.push(node);

				// invoke the 'addDownstream' onto
				// the new source
				node.addDownstream(this);
			}
		}

		return this;
	};

	/**
	 * Returns the upper node at a given index.
	 * If no index is passed as argument,
	 * return all upper nodes.
	 *
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	exports.getUpstream = function getUpstream(index) {

		if (arguments.length === 0) {
			return this.upstreamNodes;
		} else {
			return this.upstreamNodes[index];
		}
	};

	/**
	 * Checks whether a given node is
	 * @param  {[type]}  node [description]
	 * @return {Boolean}      [description]
	 */
	exports.isUpstream = function isUpstream(node) {

		if (arguments.length === 0) {
			// simply check if there are upper nodes
			return this.getUpstream().length !== 0;
		} else {
			// check if the node is in the immediate list
			return this.getUpstream().indexOf(node) !== -1;
		}
	};











	/////////////////
	// DESTINATION //
	/////////////////
	exports.getDownstream = function getDownstream(index) {
		if (arguments.length === 0) {
			return this.downstreamNodes;
		} else {
			return this.downstreamNodes[index];
		}
	};

	/**
	 * Add nodes downstream.
	 * @param {[type]} node [description]
	 */
	exports.addDownstream = function addDownstream(node) {
		if (Array.isArray(node)) {
			node.forEach(this.addDownstream.bind(this));
		} else {
			if (!this.isDownstream(node)) {
				this.downstreamNodes.push(node);
				node.addUpstream(this);
			}
		}
	};

	exports.isDownstream = function isDownstream(node) {
		if (arguments.length === 0) {
			// no specific node queried
			// simply verify if instance has destination
			return this.getDownstream().length !== 0;
		} else {
			// check if a specific node is in the immediate destination list
			return this.getDownstream().indexOf(node) !== -1;
		}
	};

});
