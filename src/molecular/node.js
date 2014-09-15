/**
 * Defines an object factory that is conscious of chain position
 * and is capable of operatijng as a link in a chain of responsibility.
 */

define(function defMolecularNode(require, exports, module) {

	// load base molecular factory.
	var factory = require('subject');


	var aux = require('molecular/auxiliary');


	var molecularNode = factory({
		initialize: function initializeMolecularNode(options) {

			options = options || {};

			this.children = options.children || [];
			this.parents  = options.parents  || [];

			/**
			 * Hash on which event handlers will be set.
			 * @type {Object}
			 */
			this._eventHandlers = {};
		},

		getParent: function getParent(index) {

			if (arguments.length === 0) {
				return this.parents;
			} else {
				return this.parent[index];
			}
		},

		addParent: function addParent(parent) {
			if (Array.isArray(parent)) {
				parent.forEach(function (parent) {
					parent.addChild(this);

					this.parent.push(parent);
				}.bind(this));
			} else {
				parent.addChild(this);
				this.parent.push(parent);
			}

			return this;
		},

		getChild: function getChild(index) {

			if (arguments.length === 0) {
				return this.children;
			} else {
				return this.children[index];
			}

		},

		addChild: function addChild(child) {


			if (Array.isArray(child)) {
				child.forEach(function (child) {
					child.addParent(this);

					this.child.push(child);
				}.bind(this));
			} else {
				child.addParent(this);
				this.child.push(child);
			}

			return this;
		},
	});

	molecularNode
		.assignProto(require('molecular/node/event-system'))
		.assignProto(require('molecular/node/command-system'));

	module.exports = molecularNode;
});
