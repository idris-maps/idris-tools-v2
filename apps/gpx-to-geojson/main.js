var drop = require('../../components/drop-zone-gpx/index')
var convert = require('../../components/convert-gpx/index')

window.onload = function() {
	init()
}

function init() {
	drop('converter', function(data) { 
		convert('converter', data, function() {
			init()
		})
	})
}
