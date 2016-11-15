var util = require('./utils')

exports.draw = function(evt, map) {
	var start = null
	var end = null
	var layer = null
	var drawing = false
	var draw = function(pt) {
		if(layer) { map.removeLayer(layer) }
		layer = L.geoJSON(util.toFeat(start, pt), { color: '#CE7668' })
		layer.addTo(map) 
	}
	var fn = function() {
		map.doubleClickZoom.disable()
		map.on('dblclick', function(e1) {
			if(!start && !end) {
				start = e1.latlng
				drawing = true
				document.getElementById('info').innerHTML = 'Double click again to finish the rectangle'
				map.on('dblclick', function(e2) {
					if(end === null) {
						end = e2.latlng
						evt.emit('rect', util.toBbox(start, end), layer)
						drawing = false
						map.off('mousemove')
						map.doubleClickZoom.enable()
					}
				})
			}
		})
		map.on('mousemove', function(e3) {
			if(drawing) {
				draw(e3.latlng)
			}
		})
	}
	return fn
}

exports.type = function(evt, bb) {
	var fn = function() {
		document.getElementById('within').onclick = function() { evt.emit('type', bb, 'within') }
		document.getElementById('crop').onclick = function() { evt.emit('type', bb, 'crop') }
		document.getElementById('intersect').onclick = function() { evt.emit('type', bb, 'intersect') }
		document.getElementById('redraw').onclick = function() { evt.emit('redraw') }		
	}
	return fn
}





