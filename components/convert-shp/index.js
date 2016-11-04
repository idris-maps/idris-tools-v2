var shp = require('shpjs')
var save = require('../utils/save')

module.exports = function(buffer, callback) {
	shp(buffer).then(function(data) {
		getNameAndCol(data, function(name, col) {
			save.json(name, col)
			callback()
		})
	})
}

function getNameAndCol(data, callback) {
	var col = {}
	col.type = data.type
	col.features = data.features
	var name = data.fileName + '.json'
	callback(name, col)
}
