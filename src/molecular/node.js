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
			if (options.child) {
				this.children.push(options.child)
			}


			this.parents = options.parents || [];
			if (options.parent) {
				this.parents.push(options.parent);
			}

			/**
			 * Hash on which event handlers will be set.
			 * @type {Object}
			 */
			this._eventHandlers = {};
		},

	});

	molecularNode
		.assignProto(require('molecular/node/tree-system'))
		.assignProto(require('molecular/node/event-system'))
		.assignProto(require('molecular/node/command-channel'));

	module.exports = molecularNode;
});
