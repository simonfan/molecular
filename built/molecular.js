//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

//     Molecular
//     (c) sfan
//     Molecular is licensed under the MIT terms.

define("__subject/private/assign",["require","exports","module","lodash"],function(e,t,n){function i(e,t,n){if(s.defaults(n,o),!s.isArray(t))throw new Error("Currently subject.assign does not accept non-array properties for accessor assignment.");s.each(t,function(t){var i=s.extend({},n);i.get&&(i.get=s.partial(i.get,t)),i.set&&(i.set=s.partial(i.set,t)),Object.defineProperty(e,t,i)})}function r(e,t,n){s.defaults(n,a),s.each(t,function(t,i){var r=s.assign({value:t},n);Object.defineProperty(e,i,r)})}var s=e("lodash"),o={configurable:!0,enumerable:!0},a=s.extend({writable:!0},o);n.exports=function(e,t,n){return n?n.get||n.set?i(e,t,n):r(e,t,n):s.assign(e,t),e}}),define("__subject/public/assign-proto",["require","exports","module","lodash","../private/assign"],function(e,t,n){var i=e("lodash"),r=e("../private/assign");n.exports=function(){var e,t;return i.isObject(arguments[0])?(e=arguments[0],t=arguments[1]):i.isString(arguments[0])&&(e={},e[arguments[0]]=arguments[1],t=arguments[2]),r(this.prototype,e,t),this}}),define("__subject/public/proto-merge",["require","exports","module","lodash","../private/assign"],function(e,t,n){var i=e("lodash"),r=e("../private/assign");n.exports=function(){var e,t,n;if(i.isString(arguments[0])){var s=arguments[0];e=this.prototype[s],t=arguments[1],n=arguments[2],this.prototype[s]=r(i.create(e),t,n)}else n=arguments[1],i.each(arguments[0],i.bind(function(e,t){this.protoMerge(t,e,n)},this));return this}}),define("__subject/public/extend",["require","exports","module","lodash","../private/assign"],function(e,t,n){var i=e("lodash"),r=e("../private/assign");n.exports=function(e,t){var n,s=this;return n=function(){var e=i.create(n.prototype);return e.initialize.apply(e,arguments),e},r(n,i.pick(s,s.staticProperties),{enumerable:!1}),n.prototype=i.create(s.prototype),n.assignProto(e,t),r(n.prototype,{constructor:n,__super__:s.prototype},{enumerable:!1}),n}}),define("subject",["require","exports","module","lodash","./__subject/private/assign","./__subject/public/assign-proto","./__subject/public/assign-proto","./__subject/public/proto-merge","./__subject/public/extend"],function(e,t,n){var i=e("lodash"),r=e("./__subject/private/assign"),s=function(){};s.prototype=r({},{initialize:function(){}},{enumerable:!1}),r(s,{staticProperties:["proto","assignProto","protoMerge","staticProperties","assignStatic","extend"],assignStatic:function(){var e,t,n;return i.isString(arguments[0])?(e={},e[arguments[0]]=arguments[1],t=[arguments[0]],n=arguments[2]):i.isObject(arguments[0])&&(e=arguments[0],t=i.keys(e),n=arguments[1]),this.staticProperties=i.union(this.staticProperties,t),r(this,e,n)},assignProto:e("./__subject/public/assign-proto"),proto:e("./__subject/public/assign-proto"),protoMerge:e("./__subject/public/proto-merge"),extend:e("./__subject/public/extend")},{enumerable:!1}),n.exports=i.bind(s.extend,s);var o={assign:r};r(n.exports,o,{enumerable:!1,writable:!1,configurable:!1})}),define("molecular/auxiliary",["require","exports","module"],function(e,t){t.transfer=function(e,t,n){_.each(e,function(e){n[e]||(n[e]=t[e])})},t.toCamelCase=function(e){return e.replace(/[-_\s]+(.)?/g,function(e,t){return t?t.toUpperCase():""})},t.toDashed=function(e){return e.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()})}}),define("molecular/node/event-system",["require","exports","module","es5-shim"],function(e,t){e("es5-shim"),t.addEventListener=function(e,t){this._eventHandlers[e]=this._eventHandlers[e]||[],this._eventHandlers[e].push(t)},t.emit=function(e,t){t=t||{},t.type||(t.type=e),t.emitter||(t.emitter=this);var n=!0;if(t.stopPropagation=function(){n=!1},_.each(this._eventHandlers[e],function(e){e(t)}),n){var i=this.getParent();i&&i.emit(e,t)}}}),define("molecular/node/command-system",["require","exports","module","es5-shim","q"],function(e,t){function n(e,t){var n=u.defer();return n.issuer=this,n.name=e,n.options=t,n.propagation=t.propagation||"bubble",n}function i(e){var t=new Error(["[molecular/node/command-system]",'No resolver was found for "'+e.name+'"',"command."].join(" "));return t}function r(e,t){var n=e.getParent();n?s(n,t):t.reject(i(t))}function s(e,t){u.fcall(e.handleCommand.bind(e),t.name,t.options).then(function(e){return t.resolve(e),t.promise},function(){r(e,t)})}function o(e,t){var n=e.shift();n?a(n,t,e):t.reject(i(t))}function a(e,t,n){u.fcall(e.handleCommand.bind(e),t.name,t.options).then(function(e){return t.resolve(e),t.promise},function(){o(n,t)})}e("es5-shim");var u=e("q");t.issueCommand=function(e,t){var i=n(e,t);if("bubble"===i.propagation)r(this,i);else{var s=_.clone(this.getChildren());s.forEach(function(e){s=s.concat(e.getChildren())}),o(s,i)}return i.promise},t.handleCommand=function(e,t){return this[e](t)},t.getCommandHandler=function(e){var t=this[e];return _.isFunction(t)?t:void 0}}),define("molecular/node",["require","exports","module","subject","molecular/auxiliary","molecular/node/event-system","molecular/node/command-system"],function(e,t,n){var i=e("subject"),r=e("molecular/auxiliary"),s=i({initialize:function(e){e=e||{},r.transfer(["parent"],e,this),this.children=[],this._eventHandlers={}},getParent:function(){return this.parent},setParent:function(e){return this.parent=e,this},addChildren:function(e){return Array.isArray(e)?e.forEach(function(e){e.setParent(this),this.children.push(e)}.bind(this)):(e.setParent(this),this.children.push(e)),this},getChildren:function(){return this.children}});s.assignProto(e("molecular/node/event-system")).assignProto(e("molecular/node/command-system")),n.exports=s}),define("molecular/view/directives/dom-events",["require","exports","module"],function(e,t){function n(e){this[e].apply(this,_.toArray(arguments).slice(2))}t.mClick=function(e,t){e.on("click",_.partial(n,t,e).bind(this))},t.mMouseover=function(e,t){e.on("mouseover",_.partial(n,t,e).bind(this))}}),define("molecular/view/directives",["require","exports","module","es5-shim","lodash","molecular/view/directives/dom-events"],function(e,t){e("es5-shim");var n=e("lodash");n.assign(t,e("molecular/view/directives/dom-events")),t.mView=function(t,n){e([n],function(e){var n=e({element:t});this.addChildren(n)}.bind(this))},t.mClickCommand=function(e,t){t=n.isString(t)?JSON.parse(t):t,e.on("click",function(){this.issueCommand(t)}.bind(this))}}),define("molecular/view/dom-manipulation",["require","exports","module","jquery"],function(e,t){t.DOMElementAdapter=e("jquery")}),define("molecular/view/rendering",["require","exports","module","es5-shim","lodash"],function(e,t){e("es5-shim");var n=e("lodash");t.render=function(e){var t,i=this.template;if(i){var r=this.parseTemplateData(e);n.isString(i)&&(i=this.template=this.compileTemplate(i)),t=i(r),this.element.html(t)}return this},t.parseTemplateData=function(e){return e},t.template=void 0,t.compileTemplate=n.template}),define("molecular/view",["require","exports","module","lodash","molecular/node","molecular/auxiliary","molecular/view/directives","molecular/view/dom-manipulation","molecular/view/rendering"],function(e,t,n){function i(e,t){var n="[data-"+o.toDashed(t)+"]";return e.find(n)}var r=e("lodash"),s=e("molecular/node"),o=e("molecular/auxiliary"),a=s.extend({initialize:function(e){s.prototype.initialize.call(this,e),o.transfer(["element","template","render","compileTemplate"],e,this),this.element=this.DOMElementAdapter(e.element),this.render(e),r.each(this.directives,function(e,t){var n=i(this.element,t);r.each(n,function(n){n=this.DOMElementAdapter(n);var i=n.data(t);e.call(this,n,i)}.bind(this))}.bind(this))},directives:e("molecular/view/directives")});a.assignProto(e("molecular/view/dom-manipulation")).assignProto(e("molecular/view/rendering"));var u=a.extend;a.assignStatic("extend",function(e,t){return e.directives=r.assign({},this.prototype.directives,e.directives),u.call(this,e,t)}),n.exports=a}),define("molecular",["require","exports","module","molecular/node","molecular/view"],function(e,t){t.node=e("molecular/node"),t.view=e("molecular/view")});