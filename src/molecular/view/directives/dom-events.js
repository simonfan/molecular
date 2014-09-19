define(function defDOMEventsDirectives(require, exports, module) {


	var JSON5 = require('json5');

	function handleDOMEvent(handlerName, args) {

		var fn = this[handlerName];

		if (!_.isFunction(fn)) {
			throw new Error('[molecular/view] "' + handlerName + '" is not a function.');
		}

		fn.apply(this, args);
	}


	// matches: name(args)
	var re = /(.+?)\((.*?)\)/;
	function parseHandlerDefinition(str) {

		var match = str.match(re);

		if (!match) {
			return {
				name: str,
				args: []
			}
		}

		return {
			name: match[1],
			args: JSON5.parse('[' + match[2] + ']'),
		};
	}


	/**
	 * <div data-m-click="something"></div>
	 *
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	exports.mClick = function clickDirective(element, handlerDefinition) {
		var handler = parseHandlerDefinition(handlerDefinition);
		element.on('click', _.partial(handleDOMEvent, handler.name, handler.args).bind(this));
	};


	exports.mMouseover = function mouseoverDirective(element, handlerDefinition) {
		var handler = parseHandlerDefinition(handlerDefinition);
		element.on('mouseover', _.partial(handleDOMEvent, handler.name, handler.args).bind(this));
	};
})
