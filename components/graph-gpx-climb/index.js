var addDist = require('./lib/add-distance')
var cleanData = require('./lib/clean-point-data')

module.exports = function(divId, data, callback) {
	addDist(data, function(withDist) {
		cleanData(withDist, function(climbData) {
			console.log(climbData)
		})
	})	
}
