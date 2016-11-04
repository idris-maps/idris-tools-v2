var Papa = require('papaparse')

module.exports = function(data, callback) {
	Papa.parse(data, {
		complete: function(results) {
			callback(results)
		}
	})
}
