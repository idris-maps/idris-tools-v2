var drop = require('../../components/drop-zone-geojson-simple/index')
var convert = require('../../components/convert-to-sql/index')

window.onload = function() {
	init()
}

function init() {
	drop('converter', function(data) { 
		convert(data, function() {
			init()
		})
	})
}
