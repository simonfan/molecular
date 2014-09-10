define(function defMolecularListModel(require, exports, module) {

	var subject = require('subject');


	var molecularItem = require('molecular/data/model/item');

	var molecularList = subject({
		initialize: function initializeMolecularList(data, options) {

			this.data = data;
		},

		itemModel: molecularItem,
	});

	module.exports = molecularList;

});
