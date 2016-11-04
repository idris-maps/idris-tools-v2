var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var Emitter = require('events').EventEmitter

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	html.init(divId, function() {
		ctrl(divId, data, evt)
	})
	evt.on('gpx-converted', function() {
		callback()
	})
}
