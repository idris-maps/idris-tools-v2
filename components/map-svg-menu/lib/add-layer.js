var drop = require('../../drop-zone-geojson-for-map/index')
var geo = require('../../utils/geo')

module.exports = function(menu) {
	drop(menu.divId, function(data) {
		data.forEach(function(d) {
			menu.map.addLayer({name: d.name, type: d.type, data: d.collection})
		})
		menu.close()
	})
}
