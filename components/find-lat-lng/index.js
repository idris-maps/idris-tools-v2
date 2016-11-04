module.exports = function() {
	if(L) { run() }
	else { console.log('\"Find latitude - longitude\" needs leaflet') }
}

function run() {
	var map = L.map('map').setView([0,0],2)
	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	})
	tiles.addTo(map)

	var marker
	map.on('click', function(e) {
		if(typeof(marker)==='undefined') {
		 marker = new L.marker(e.latlng)
		 marker.addTo(map)   
		} else {
		 marker.setLatLng(e.latlng)        
		}
		var p = e.latlng
		var str = 'latitude: ' + s(p.lat) + '</br>'
			+ 'longitude: ' + s(p.lng) + '</br>'
			+ '[' + s(p.lng) + ',' + s(p.lat) + ']' 
		marker.bindPopup(str).openPopup()
	})
}

function s(n) {
	return Math.floor(n * 1000000) / 1000000
}
