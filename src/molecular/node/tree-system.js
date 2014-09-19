define(function defNodeTreeManagement(require, exports, module) {

	// load es5-shim
	require('es5-shim');

	/////////////////////////
	/// PARENT MANAGEMENT ///
	/////////////////////////




	/**
	 * Returns the upper node at a given index.
	 * If no index is passed as argument,
	 * return all upper nodes.
	 *
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	exports.getUpper = function getUpper(index) {

		if (arguments.length === 0) {
			return this.upperNodes;
		} else {
			return this.upperNodes[index];
		}
	};

	/**
	 * Returns the full upstream array of nodes.
	 *
	 * @return {[type]} [description]
	 */
	exports.getUpstream = function getUpstream() {

		// [1] get immediate upper nodes of the current node.
		var nodes = _.clone(this.getUpper());

		// [2] loop through the immediate upper nodes
		//     and add their immediate upper nodes to
		//     the array of nodes
		//     until no nodes are found upwards.
		nodes.forEach(function (n) {
			nodes = nodes.concat(n.getUpper());
		});

		return nodes;
	};



	/**
	 * Checks whether a given node is
	 * @param  {[type]}  node [description]
	 * @return {Boolean}      [description]
	 */
	exports.hasUpper = function hasUpper(node) {

		if (arguments.length === 0) {
			// simply check if there are upper nodes
			return this.getUpper().length !== 0;
		} else {
			// check if the node is in the immediate list
			return this.getUpper().indexOf(node) !== -1;
		}
	};

	exports.getLower = function getLower(index) {

	};

	exports.getDownstream = function getDownstream() {

	};

	exports.hasLower = function hasLower(node) {

	};

	/**
	 * Retrieves the parent at a given index.
	 * If no index is given
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	exports.getParent = function getParent(index) {

		if (arguments.length === 0) {
			return this.parents;
		} else {
			return this.parent[index];
		}
	};

	exports.hasParent = function hasParent(parent) {
		return this.parents.indexOf(parent) !== -1;
	};

	exports.addParent = function addParent(parent) {
		if (Array.isArray(parent)) {
			parent.forEach(this.addParent.bind(this));
		} else {

			if (!this.hasParent(parent)) {
				this.parents.push(parent);
				parent.addChild(this);
			}
		}

		return this;
	};

	/////////////////////////
	/// PARENT MANAGEMENT ///
	/////////////////////////


	///////////////////////////
	/// CHILDREN MANAGEMENT ///
	///////////////////////////

	/**
	 * Retrieves a child at a given index.
	 * If no index is passed, returns all children.
	 *
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	exports.getChild = function getChild(index) {

		if (arguments.length === 0) {
			return this.children;
		} else {
			return this.children[index];
		}
	};

	/**
	 * Verifies if the child is already in the children array.
	 * @param  {[type]}  child [description]
	 * @return {Boolean}       [description]
	 */
	exports.hasChild = function hasChild(child) {

		return this.children.indexOf(child) !== -1;
	};

	/**
	 * Adds the child object to the children array and attempts to
	 * set its parent.
	 * @param {[type]} child [description]
	 */
	exports.addChild = function addChild(child) {


		if (Array.isArray(child)) {
			child.forEach(function (c) {
				if (!this.hasChild(c)) {
					this.children.push(c);
					c.addParent(this);
				}
			}.bind(this));
		} else {

			if (!this.hasChild(child)) {
				this.children.push(child);
				child.addParent(this);
			}
		}

		return this;
	};

	///////////////////////////
	/// CHILDREN MANAGEMENT ///
	///////////////////////////

});
