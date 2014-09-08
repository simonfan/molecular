define(function defDOMEventsDirectives(require, exports, module) {

	function handleDOMEvent(handlerName, element, event) {
		this[handlerName].apply(this, _.toArray(arguments).slice(2));
	}

	/**
	 * <div data-m-click="something"></div>
	 *
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	exports.mClick = function clickDirective(element, handlerName) {
		element.on('click', _.partial(handleDOMEvent, handlerName, element).bind(this));
	};


	exports.mMouseover = function mouseoverDirective(element, handlerName) {
		element.on('mouseover', _.partial(handleDOMEvent, handlerName, element).bind(this));
	};
})
