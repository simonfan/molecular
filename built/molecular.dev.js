//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

define("__subject/private/assign",["require","exports","module","lodash"],function(e,t,r){function s(e,t,r){if(n.defaults(r,a),!n.isArray(t))throw new Error("Currently subject.assign does not accept non-array properties for accessor assignment.");n.each(t,function(t){var s=n.extend({},r);s.get&&(s.get=n.partial(s.get,t)),s.set&&(s.set=n.partial(s.set,t)),Object.defineProperty(e,t,s)})}function i(e,t,r){n.defaults(r,o),n.each(t,function(t,s){var i=n.assign({value:t},r);Object.defineProperty(e,s,i)})}var n=e("lodash"),a={configurable:!0,enumerable:!0},o=n.extend({writable:!0},a);r.exports=function(e,t,r){return r?r.get||r.set?s(e,t,r):i(e,t,r):n.assign(e,t),e}}),define("__subject/public/assign-proto",["require","exports","module","lodash","../private/assign"],function(e,t,r){var s=e("lodash"),i=e("../private/assign");r.exports=function(){var e,t;return s.isObject(arguments[0])?(e=arguments[0],t=arguments[1]):s.isString(arguments[0])&&(e={},e[arguments[0]]=arguments[1],t=arguments[2]),i(this.prototype,e,t),this}}),define("__subject/public/proto-merge",["require","exports","module","lodash","../private/assign"],function(e,t,r){var s=e("lodash"),i=e("../private/assign");r.exports=function(){var e,t,r;if(s.isString(arguments[0])){var n=arguments[0];e=this.prototype[n],t=arguments[1],r=arguments[2],this.prototype[n]=i(s.create(e),t,r)}else r=arguments[1],s.each(arguments[0],s.bind(function(e,t){this.protoMerge(t,e,r)},this));return this}}),define("__subject/public/extend",["require","exports","module","lodash","../private/assign"],function(e,t,r){var s=e("lodash"),i=e("../private/assign");r.exports=function(e,t){var r,n=this;return r=function(){var e=s.create(r.prototype);return e.initialize.apply(e,arguments),e},i(r,s.pick(n,n.staticProperties),{enumerable:!1}),r.prototype=s.create(n.prototype),r.assignProto(e,t),i(r.prototype,{constructor:r,__super__:n.prototype},{enumerable:!1}),r}}),define("subject",["require","exports","module","lodash","./__subject/private/assign","./__subject/public/assign-proto","./__subject/public/assign-proto","./__subject/public/proto-merge","./__subject/public/extend"],function(e,t,r){var s=e("lodash"),i=e("./__subject/private/assign"),n=function(){};n.prototype=i({},{initialize:function(){}},{enumerable:!1}),i(n,{staticProperties:["proto","assignProto","protoMerge","staticProperties","assignStatic","extend"],assignStatic:function(){var e,t,r;return s.isString(arguments[0])?(e={},e[arguments[0]]=arguments[1],t=[arguments[0]],r=arguments[2]):s.isObject(arguments[0])&&(e=arguments[0],t=s.keys(e),r=arguments[1]),this.staticProperties=s.union(this.staticProperties,t),i(this,e,r)},assignProto:e("./__subject/public/assign-proto"),proto:e("./__subject/public/assign-proto"),protoMerge:e("./__subject/public/proto-merge"),extend:e("./__subject/public/extend")},{enumerable:!1}),r.exports=s.bind(n.extend,n);var a={assign:i};i(r.exports,a,{enumerable:!1,writable:!1,configurable:!1})});
define('molecular/auxiliary',['require','exports','module'],function defMolecularAuxiliary(require, exports, module) {

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

define('molecular/node/event-system',['require','exports','module','es5-shim'],function defMolecularNodeEventSystem(require, exports, module) {

	require('es5-shim');

	exports.addEventListener = function addEventListener(eventType, handler) {
		this._eventHandlers[eventType] = this._eventHandlers[eventType] || [];

		this._eventHandlers[eventType].push(handler);
	};

	exports.emit = function emit(eventType, eventData) {

		eventData = eventData || {};

		if (!eventData.type) {
			eventData.type = eventType;
		}

		// if no emitter is set on the event eventData,
		// set it as this
		if (!eventData.emitter) {
			eventData.emitter = this;
		}

		// let the bubble flag as true initially.
		var bubble = true;

		// make available a method that cancels propagation of the event.
		eventData.stopPropagation = function () { bubble = false; };

		_.each(this._eventHandlers[eventType], function (handler) {
			handler(eventData);
		});

		// if bubble was not cancelled
		// let the parent emit.
		if (bubble) {

			var parent = this.getParent();

			if (parent) {
				parent.emit(eventType, eventData);
			}
		}

	};
});

define('molecular/node/request-system',['require','exports','module','q'],function defMolecularViewRequestChain(require, exports, module) {

	var q = require('q');


	/**
	 * Builds a request object to be passed on.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}         [description]
	 */
	exports.buildRequestObject = function buildRequestObject(name, data) {

		var request = q.defer();

		// set data
		request.data = data;

		return request;
	};

	/**
	 * Initialize a request.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}         [description]
	 */
	exports.issueRequest = function issueRequest(name, data) {

		// build a request object
		var request = this.buildRequestObject(name, data);

		// process the request.
		this.processRequest(name, request);


		return request.promise;
	};


	/**
	 * Attempts to handle a request.
	 * Checks if the current object can handle the request by
	 * calling `canHandleRequest`.
	 *
	 * If is able of resolving the request,
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} request [description]
	 * @return {[type]}         [description]
	 */
	exports.processRequest = function processRequest(name, request) {

		if (this.canHandleRequest(name, request)) {
			// can handle
			this.handleRequest(name, request);
		} else {
			// cannot handle

			// attempt to retrieve the parent object and let
			// the parent process the request.
			var parent = this.getParent();
			if (parent) {
				// let parent processRequest
				parent.processRequest(name, request);

			} else {
				// reject, as no resolver was found
				// and this object is root.
				request.reject(new Error('No resolver for ' + name + ' was found.'));
			}
		}
	};

	/**
	 * Request handling.
	 *
	 * This method is called once the `canHandleRequest` responds true for
	 * a given request.
	 */
	exports.handleRequest = function handleRequest(name, request) {

		var res = this[name](request.data);


		request.resolve(res);
	};

	/**
	 * Synchronous.
	 *
	 * Verifies if the current object is capable of handling a given request.
	 *
	 * @param  {[type]} name    [description]
	 * @param  {[type]} request [description]
	 * @return {[type]}         [description]
	 */
	exports.canHandleRequest = function canHandleRequest(name, request) {
		return _.isFunction(this[name]);
	};

});

/**
 * Defines an object factory that is conscious of chain position
 * and is capable of operatijng as a link in a chain of responsibility.
 */

define('molecular/node',['require','exports','module','subject','molecular/auxiliary','molecular/node/event-system','molecular/node/request-system'],function defMolecularViewRequestChain(require, exports, module) {

	// load base molecular factory.
	var factory = require('subject');


	var aux = require('molecular/auxiliary');


	var molecularNode = factory({
		initialize: function initializeMolecularNode(options) {

			options = options || {};

			aux.transfer(['parent'], options, this);


			/**
			 * Array on which children nodes will be stored.
			 * @type {Array}
			 */
			this.children = [];


			/**
			 * Hash on which event handlers will be set.
			 * @type {Object}
			 */
			this._eventHandlers = {};
		},

		getParent: function getParent() {
			return this.parent;
		},

		setParent: function setParent(parent) {
			this.parent = parent;

			return this;
		},

		/**
		 * Puts children objects into the node.
		 * @param {[type]} children [description]
		 */
		addChildren: function addChildren(children) {

			// make sure the children is an array.
			children = Array.isArray(children) ? children : [children];

			children.forEach(function (child) {
				child.setParent(this);

				this.children.push(child);
			}.bind(this));

			return this;
		},
	});

	molecularNode
		.assignProto(require('molecular/node/event-system'))
		.assignProto(require('molecular/node/request-system'));

	module.exports = molecularNode;
});

define('molecular/view/directives/dom-events',['require','exports','module'],function defDOMEventsDirectives(require, exports, module) {

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
;
define('molecular/view/directives',['require','exports','module','es5-shim','lodash','molecular/view/directives/dom-events'],function defMolecularViewDirectiveSystem(require, exports, module) {

	require('es5-shim');

	var _ = require('lodash');

	/**
	 * DOM events directives.
	 */
	_.assign(exports, require('molecular/view/directives/dom-events'));

	/**
	 * [mView description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} value   [description]
	 * @return {[type]}         [description]
	 */
	exports.mView = function viewDirective(element, moduleName) {

		console.log(moduleName);

		var viewModule = require([moduleName], function (viewModule) {

			// instantiate
			var viewInstance = viewModule({ element: element });

			// add viewInstance
			this.addChildren(viewInstance);

		}.bind(this));
	};


});

define('molecular/view/dom-manipulation',['require','exports','module','jquery'],function defMolecularViewDOM(require, exports, module) {



	/**
	 * The
	 * @type {[type]}
	 */
	exports.DOMElementAdapter = require('jquery');





});

define('molecular/view/rendering',['require','exports','module','es5-shim','lodash'],function defMolecularViewRendering(require, exports, module) {

	require('es5-shim');

	var _ = require('lodash');

	exports.render = function render(options) {
		var template = this.template,
			html;

		if (template) {
			// only render if a template is available

			// parse out data from options
			var data = this.parseTemplateData(options);

			// if template is still a string, override it
			// with the compiled function
			if (_.isString(template)) {
				template = this.template = this.compileTemplate(template);
			}

			// run template
			html = template(data);

			// insert html
			this.element.html(html);
		}

		return this;
	};

	exports.parseTemplateData = function parseTemplateData(d) {
		return d;
	};

	/**
	 * Template defaults to undefined.
	 * @type {[type]}
	 */
	exports.template = void(0);

	/**
	 * Should return a function.
	 * @type {[type]}
	 */
	exports.compileTemplate = _.template;

});

define('molecular/view',['require','exports','module','lodash','molecular/node','molecular/auxiliary','molecular/view/directives','molecular/view/dom-manipulation','molecular/view/rendering'],function defMolecularView(require, exports, module) {

	var _ = require('lodash');

	var node = require('molecular/node'),
		aux  = require('molecular/auxiliary');


	/**
	 * Finds all elements that should be processed by a
	 * given directive given a rootElement and a directiveName
	 */
	function findDirectedElements(rootElement, directiveName) {
		var selector = '[data-' + aux.toDashed(directiveName) + ']';

		return rootElement.find(selector);
	}

	/**
	 * Define the viewFactory
	 */
	var viewFactory = node.extend({

		initialize: function initializeMolecularView(options) {

			node.prototype.initialize.call(this, options);

			/**
			 * Pick some options.
			 */
			aux.transfer([
				'element',

				'template',
				'render',
				'compileTemplate'
			], options, this);

			/**
			 * The adapted DOM element.
			 *
			 * @type {[type]}
			 */
			this.element = this.DOMElementAdapter(options.element);

			////////////
			// render //
			////////////
			this.render(options);

			///////////////////////////
			// initialize directives //
			///////////////////////////
			_.each(this.directives, function (directiveFn, directiveName) {
				// [1] find elements to be directed.
				var directedElements = findDirectedElements(this.element, directiveName);

				// [2] loop directed elements
				_.each(directedElements, function (element) {

					// [2.1] wrap and read data
					element = this.DOMElementAdapter(element);

					var directiveValue = element.data(directiveName);

					// [2.2] invoke directiveFn
					//       passing element and directive value.
					directiveFn.call(this, element, directiveValue)

				}.bind(this));

			}.bind(this));
		},

		/**
		 * Define directives.
		 * @type {[type]}
		 */
		directives: require('molecular/view/directives')
	});

	viewFactory
		.assignProto(require('molecular/view/dom-manipulation'))
		.assignProto(require('molecular/view/rendering'));

	/**
	 * Keep reference to the original extend method.
	 * @type {[type]}
	 */
	var _originalExtend = viewFactory.extend;
	// define new behaviour for extend.
	viewFactory.assignStatic('extend', function extendMolecularViewFactory(extensions, options) {
		extensions.directives = _.assign({}, this.prototype.directives, extensions.directives);

		return _originalExtend.call(this, extensions, options);
	});

	module.exports = viewFactory;

});

//     Molecular
//     (c) sfan
//     Molecular is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module Molecular
 */

define('molecular',['require','exports','module','molecular/node','molecular/view'],function defMolecular(require, exports, module) {


	exports.node = require('molecular/node');
	exports.view = require('molecular/view');


});

