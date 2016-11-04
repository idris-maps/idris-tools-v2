var drop = require('../../components/drop-zone-zip/index')
var convert = require('../../components/convert-shp/index')

window.onload = function() {
	init()
}

function init() {
	drop('converter', function(buffer) {
		convert(buffer, function() {
			init()
		})
	})
}
