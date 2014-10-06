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

			// default options.
			options = options || {};

			/**
			 * Array to hold all the nodes upstream and downstream.
			 * @type {Array}
			 */
			this.upstreamNodes   = [];
			this.downstreamNodes = [];

			if (options.upstream) {
				this.addUpstream(options.upstream);
			}

			if (options.downstream) {
				this.addDownstream(options.downstream);
			}
		},

	});

	molecularNode
		.assignProto(require('molecular/node/channel-system'))
		.assignProto(require('molecular/node/message-system'))
		.assignProto(require('molecular/node/invocation-system'))
		.assignProto(require('molecular/node/event-system'));

	module.exports = molecularNode;
});
