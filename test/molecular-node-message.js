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

	describe('molecularNode molecular-node-message', function () {
		beforeEach(function (done) {
			done();
		});


		it('message channel system', function () {

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
				})({ upstream: root }),
				branch11 = molecularNode({ upstream: branch1 }),
				branch2 = molecularNode({ upstream: root });



			var res = branch11.sendMessage({
				type     : 'invocation',
				method   : 'navigate',
				direction: 'upstream',
				data: {
					name: 'Someone'
				}
			});

			res.should.eql('ok-branch1');


			branch1.sendMessage({
				type: 'invocation',
				method: 'navigate',
				direction: 'upstream',
			}).should.eql('ok-branch1');
		});

		it('multi-upstream', function () {


			var node = molecularNode.extend({
				// simply assign all options to this object.
				initialize: function (options) {
					molecularNode.prototype.initialize.apply(this, _.toArray(arguments));
					_.each(options, function (v, k) {
						this[k] = v;
					}.bind(this))
				}
			});

			/**
			 * a1    a2    a3
			 *   \  /  \  /
			 *    b1    b2
			 *   /  \  /| \
			 *  c1   c2 c3 c4
 			 */

			var a1 = node(),
				a2 = node(),
				a3 = node();

			var b1 = node({
					ajaxPost: function ajaxPost(data) {
						return 'success';
					}
				}),
				b2 = node(),
				b3 = node();

			var c1 = node(),
				c2 = node(),
				c3 = node(),
				c4 = node();


			b3.addUpstream([a1, a2]);
			b2.addUpstream([a2, a3]);

			c1.addUpstream(b1);
			c2.addUpstream([b1, b2]);
			c3.addUpstream(b2);
			c4.addUpstream(b2);


			c2.sendMessage({
				type: 'invocation',
				direction: 'upstream',
				method: 'ajaxPost',
				args: ['lalala']
			}).should.eql('success');
		});
	});
});
