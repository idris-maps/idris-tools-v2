var drop = require('../../components/drop-zone-geojson-simple')
var select = require('../../components/select-by-property')

window.onload = function() {
	init()
}

function init() {
	drop('selecter', function(data) {
		select('selecter', data, function() {
			init()
		})
	})
}
