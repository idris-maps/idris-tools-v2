var html = require('./lib/html')
var ctrl = require('./lib/ctrl')

module.exports = function(divId, conf, callback) {
	html.init(divId, conf, function() {
		ctrl.init(function(r) {
			callback(r)
		})
	})
}
