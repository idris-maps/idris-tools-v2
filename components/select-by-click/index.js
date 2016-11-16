var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var L_ctrl = require('./lib/leaflet-ctrl')
var initMap = require('./lib/init-map') 

module.exports = function(divId, data, callback) {
	initMap(divId, data, function(map, layer) {
		var menu = new L_ctrl(map)
		menu.setContent(html.init, null, { 'text-align': 'center' })
		map.once('click', function() {
			menu.setContent(html.download, ctrl.download(layer), { width: '30px', height: '30px', padding: '5px' })
		})
	})
}
