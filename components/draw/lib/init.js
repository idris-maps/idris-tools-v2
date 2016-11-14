var Data = require('./Data')
var evt = require('./on-event')
var dlBtn =  require('./download-button')
var tiles = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

module.exports = function(divId) {
	var o = this
	o.data = new Data()
	o.map = L.map(divId).setView([25,0],2)
	o.dlBtn = new dlBtn(o)

	tiles.addTo(map)

	o.drawn = new L.FeatureGroup()
	map.addLayer(drawn)


	var drawControl = new L.Control.Draw({ edit: { featureGroup: drawn }})
	map.addControl(drawControl)

	removeCircle()

	o.map.on('draw:created', function(e) {
		evt.onDrawCreated(e, o)
	})

	o.drawn.on('click', function(e) {
		evt.onDrawnClick(e, o)
	})

	o.toGeoJSON = function() {
		return o.data.toGeoJSON(o.drawn)
	}





	return o
}

function removeCircle() {
	var circle = document.getElementsByClassName('leaflet-draw-draw-circle')[0]
	circle.parentNode.removeChild(circle)
}


