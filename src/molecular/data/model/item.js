define(function defMolecularItemModel(require, exports, module) {

	var subject = require('subject'),
		_       = require('lodash'),
		objectQuery = require('object-query');

	var basicSchemas = {
		'string': function (v) {},
		'virtual': function (arg, arg2) {

		},
	}


	var molecularItem = subject({


		initialize: function initializeMolecularItem(data) {

			_.assign(this, data);
		},

		/**
		 * Whether to throw errors on schema problems.
		 * @type {Boolean}
		 */
		enforceSchema: false,

		schema: {
			id: 'string',
			name: 'string',
			lastname: 'string',


			fullname: {
				get: function getFullname() {

				},

				set: function setFullname() {

				}
			}
		},

		is: function is(criteria) {

			// read values
			var values = _.mapValues(criteria, function (value, key) {
				return this.get(key);
			}.bind(this));

			if (_.isFunction(criteria)) {
				return criteria(values);
			} else {
				// assume it is an object query
				var query = objectQuery(criteria);
				return query(values);
			}
		},

		set: function set(key, value) {


			if (_.isObject(key)) {

				_.each(key, function (value, key) {

					// check if there is a type
					var schema = this.schema[key];
					if (schema) {

						// get schema processor function
						var processorFn = _.isFunction(schema) ?
							schema : (this[schema] ? this[schema]) : basicSchemas[schema];

						value = processorFn(value);
					}

					// set if changed
					if (this[key] !== value) {
						this[key] = value;

						this.emit('change');
					}

				}.bind(this));

			}
		},

		get: function get(key) {

			var value = this[key];

			// if is function, execute it.
			return _.isFunction(value) ?
				value.call(this, _.toArray(arguments).slice(1)) : value;
		},

		getAs: function getAs(key, processor) {
			var value = this.get(key);

			// get processor fn.
			processor = _.isFunction(processor) ? processor : this[processor];

			return processor(value);
		},
	});


	module.exports = molecularItem;

});
