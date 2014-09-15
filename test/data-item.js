(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'molecular',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(molecularSchema, should) {
	'use strict';

	describe('molecularSchema data-item', function () {
		beforeEach(function (done) {
			done();
		});

		it('is fine (:', function () {

			var coordinate = molecularSchema({
				lng: Number,
				lat: Number,
			});

			var city = molecularSchema({
				name: String,
				population: Number,
				coordinate: coordinate,
			});

			var country = molecularSchema({
				name: String,
				continent: String,
				capital: city,

				cities: [city],
			});

			var nationality = molecularSchema({
				name: String,
				languages: [String],
				country: country,
			});





			var car = molecularSchema({
				make: String,
				nationality: nationality,
			});

			var personSchema = molecularSchema({
				name: String,
				lastName: String,
				nationality: nationality,
				children: [personSchema],
				cars: [car],
			});


			var personModel = molecularModel.extend({
				schema: personSchema,


				// methods
				create: function () {},
				read: function () {},
				update: function () {},
				'delete': function () {},

				next: function () {},
				previous: function () {},

				findById: function () {},
			});


			var simon = personModel({
				name: 'Simon',
				lastName: 'Fan',

				children: personModel.list({
					lastName: 'Fan',
				}),

				cars: {

				}
			});

		});
	});
});
