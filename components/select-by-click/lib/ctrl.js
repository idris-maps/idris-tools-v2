var getFeats = require('./get-features') 
var save = require('../../utils/save')

exports.download = function(layer) {
	var fn = function() {
		document.getElementById('download-btn').onclick = function() {
			var col = { type: 'FeatureCollection', features: getFeats(layer) }
			save.json('selected.json', col)
		}
	}
	return fn
}
