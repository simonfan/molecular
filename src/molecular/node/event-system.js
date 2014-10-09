define(function defEventSystem(require, exports, module) {


	exports.emit = function emitEvent(event, data) {
		var message = {
			type: 'event',
			name: event,
			data: data
		};

		this.sendMessage(message);
	};
});
