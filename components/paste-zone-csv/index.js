var html = require('./lib/html')
var ctrl = require('./lib/ctrl')

module.exports = function(divId, callback) {
	html(divId, function() {
		ctrl(function(data) {
			callback(data)
		})
	})
}
