/**
 * Defines an object factory that is conscious of chain position
 * and is capable of operatijng as a link in a chain of responsibility.
 */

define(function defMolecularViewRequestChain(require, exports, module) {

	// load base molecular factory.
	var factory = require('subject');


	var aux = require('molecular/auxiliary');


	var molecularNode = factory({
		initialize: function initializeMolecularNode(options) {

			options = options || {};

			aux.transfer(['parent'], options, this);


			/**
			 * Array on which children nodes will be stored.
			 * @type {Array}
			 */
			this.children = [];


			/**
			 * Hash on which event handlers will be set.
			 * @type {Object}
			 */
			this._eventHandlers = {};
		},

		getParent: function getParent() {
			return this.parent;
		},

		setParent: function setParent(parent) {
			this.parent = parent;

			return this;
		},

		/**
		 * Puts children objects into the node.
		 * @param {[type]} children [description]
		 */
		addChildren: function addChildren(children) {

			// make sure the children is an array.
			children = Array.isArray(children) ? children : [children];

			children.forEach(function (child) {
				child.setParent(this);

				this.children.push(child);
			}.bind(this));

			return this;
		},
	});

	molecularNode
		.assignProto(require('molecular/node/event-system'))
		.assignProto(require('molecular/node/request-system'));

	module.exports = molecularNode;
});
