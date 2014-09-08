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

	describe('molecularNode molecular-node', function () {
		beforeEach(function (done) {
			done();
		});

		it('event bubbling', function () {

			// instantiate a root
			var root = molecularNode(),
				rootEventControl = {
					fired: 0,
					emitter: void(0),
				};

			// set listener on root
			root.addEventListener('test-event', function (event) {
				++rootEventControl.fired;
				rootEventControl.emitter = event.emitter;
			});

			// instantiate branhches
			var branch1 = molecularNode(),
				branch2 = molecularNode(),
				branch3 = molecularNode();

			// and add them to root
			root.addChildren([branch1, branch2, branch3]);

			// emit on branch1
			branch1.emit('test-event');

			// check rootControl
			rootEventControl.fired.should.eql(1);
			rootEventControl.emitter.should.eql(branch1);

			// emit on branch2
			branch2.emit('test-event');
			rootEventControl.fired.should.eql(2);
			rootEventControl.emitter.should.eql(branch2);

			// cancel bubbling on branch3
			var branch3EventControl = {
				fired: 0,
				emitter: void(0),
			};
			branch3.addEventListener('test-event', function (e) {
				++branch3EventControl.fired;
				branch3EventControl.emitter = e.emitter;

				// stopPropagation
				e.stopPropagation();
			});

			branch3.emit('test-event');
			branch3EventControl.fired.should.eql(1);
			branch3EventControl.emitter.should.eql(branch3);

			// root should not have been notified
			rootEventControl.fired.should.eql(2);
			rootEventControl.should.not.eql(branch3);
		});


		it('request system', function (testdone) {

			var rootControl = {};


			var rootMolecularNode = molecularNode.extend({

				navigate: function navigate(data) {
					rootControl = data;

					return 'ok';
				}
			});


			var root = rootMolecularNode(),
				branch1 = molecularNode({ parent: root }),
				branch2 = molecularNode({ parent: root }),
				branch11 = molecularNode({ parent: branch1 });

			branch11.issueRequest('navigate', {
				resource: 'books',
				query: {
					id: 15
				}
			}).done(function (res) {

				res.should.be.eql('ok');

				testdone();
			});



		});
	});
});
