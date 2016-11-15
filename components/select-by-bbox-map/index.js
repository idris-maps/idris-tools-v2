var L_Ctrl = require('./lib/leaflet-ctrl')
var ctrl = require('./lib/ctrl')
var html = require('./lib/html')
var process = require('./lib/process')
var Emitter = require('events').EventEmitter
var save = require('../utils/save')

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	var map = L.map(divId)
	var dataLayer = L.geoJSON(data, {color: '#437380'}).addTo(map)
	map.fitBounds(dataLayer.getBounds())

	var menu = new L_Ctrl(map)
	menu.setContent(html.draw, ctrl.draw(evt, map), {'text-align': 'center'})

	var rect
	evt.on('rect', function(bb, layer) {
		rect = layer
		menu.setContent(html.type, ctrl.type(evt, bb))
	})

	evt.on('type', function(bb, type) {
		var config = {
			progressId: 'progress',
			bbox: bb,
			type: type,
			feats: data.features,
			evt: evt
		}
		menu.setContent(html.process, null, {'text-align': 'center'})
		process(config)
	})

	evt.on('new-collection', function(col, name) {
		save.json(name, col)
		callback()
	})
	
	evt.on('redraw', function() {
		map.removeLayer(rect)
		menu.setContent(html.draw, ctrl.draw(evt, map), {'text-align': 'center'})
	})
}





