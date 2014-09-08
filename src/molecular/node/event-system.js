define(function defMolecularNodeEventSystem(require, exports, module) {

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
