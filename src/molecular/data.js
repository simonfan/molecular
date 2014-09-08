define(function (require, exports, module) {

	var ramda   = require('ramda'),
		_       = require('lodash'),
		factory = require('subject');


	var data = factory({
		initialize: function initialize(d, options) {

			this.initializeData(d, options);

			if (_.isArray(d)) {


				this.type = 'list';
				this.initializeList(d, options);

			} else {

				this.type = 'item';
				this.initializeItem(d, options);
			}
		},

		initializeData: function initializeData(d, options) {
			this._data = d;
		},

		isList: function isList() {
			return this.type === 'list';
		},

		isItem: function isItem() {
			return this.type === 'item';
		},






		get: function get(key) {
			return this._data[key];
		},

		set: function set(key, value) {
			this._data[key] = value;


			return this;
		}
	});

});
