(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'molecular/node',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(molecularNode, should) {
	'use strict';

	describe('molecularNode molecular-node-commands', function () {
		beforeEach(function (done) {
			done();
		});


		it('command channel system', function () {

			var rootControl = {};


			var rootMolecularNode = molecularNode.extend({

				navigate: function navigate(data) {
					rootControl = data;

					return 'ok-root';
				}
			});


			var root = rootMolecularNode(),
				branch1 = molecularNode.extend({
					navigate: function navigateB1() {
						return 'ok-branch1';
					}
				})({ parent: root }),
				branch11 = molecularNode({ parent: branch1 }),
				branch2 = molecularNode({ parent: root });


			branch1
				.sendCommandUp('navigate')
				.should.eql('ok-root', 'branch1 should use the root navigate method');

			branch11
				.sendCommandUp('navigate', { /* args */ })
				.should.eql('ok-branch1', 'branch11 should use the branch1 navigate method');

			// broadcasting
			branch11
				.broadcastCommandUp('navigate')
				.should.eql(['ok-branch1', 'ok-root']);

		});
	});
});
