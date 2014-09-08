define(function defMolecularAuxiliary(require, exports, module) {

	exports.transfer = function transfer(properties, from, to) {
		_.each(properties, function (prop) {
			if (!to[prop]) {
				to[prop] = from[prop];
			}
		});
	};


	/**
	 * Copied from Epeli's underscore.string "camelize"
	 * https://github.com/epeli/underscore.string/blob/master/lib/underscore.string.js
	 *
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	exports.toCamelCase = function toCamelCase(str) {
		return str.replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
	};

	/**
	 * Converts stuff to dashed.
	 *
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	exports.toDashed = function toDashed(str) {
		return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
	};
});
