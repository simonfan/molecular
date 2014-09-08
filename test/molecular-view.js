(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'molecular/view',
		// dependencies for the test
		deps = [mod, 'should', 'text!test/fixture.html', 'jquery'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(molecularView, should, fixture, $) {
	'use strict';

	describe('molecularView molecular-view', function () {
		beforeEach(function () {

			var $fixture = this.$fixture = $(fixture).appendTo($('body'));
		});

		afterEach(function () {
		//	this.$fixture.remove();
		});

		it('dom events', function () {


			// define a view with some functionalities
			var extendedViewFactory = molecularView.extend({
				doSomething: function () {
					alert('doSomething');
				},

				doAnotherThing: function doAnotherThing(e) {
					console.log(arguments);
				}
			});


			var view = extendedViewFactory({
				element: this.$fixture,
				template: [
					'<div data-m-click="doSomething" data-m-mouseover="doAnotherThing">',
						'CONTENT',
					'</div>'
				].join(' '),
			});

		});

		it('subviews', function () {

			define('some-view-module', function (require, exports, module) {
				module.exports = require('molecular/view').extend({

					doSomething: function doSomething() {

						this.issueRequest('navigate', {
								to: 'somewhere'
							})
							// finish promise chain
							.done();

					},
					template: [
						'<div data-m-click="doSomething">ITEM</div>'
					].join(' ')
				});
			});




			var extendedViewFactory = molecularView.extend({
				template: [
					'<div>',
						'MAIN VIEW CONTENT',
						'<div data-m-view="some-view-module"></div>',
					'</div>'
				].join(' '),


				navigate: function navigate(options) {
					console.log('navigate request received')
					console.log(options);
				}
			});


			// instantiate
			var viewInstance = extendedViewFactory({
				element: this.$fixture
			});

		});
	});
});
