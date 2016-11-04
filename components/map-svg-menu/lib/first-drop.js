var drop = require('../../drop-zone-geojson-for-map/index')
var geo = require('../../utils/geo')

module.exports = function(menu) {
	document.getElementById('close-menu-div').style.display = 'none'
	drop(menu.divId, function(data) {
		menu.map.changeBbox(geo.getBbox(data[0].collection))
		data.forEach(function(d) {
			menu.map.addLayer({name: d.name, type: d.type, data: d.collection})
		})
		menu.map.render('map')
		removeTitle()
		document.getElementById('close-menu-div').style.display = 'block'
		menu.close()
	})
}

function removeTitle() {
 var el = document.getElementById('title')
	el.parentElement.removeChild(el)
}
