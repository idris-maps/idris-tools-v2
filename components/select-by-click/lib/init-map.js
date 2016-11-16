module.exports = function(divId, data, callback) {
	var map = L.map(divId)
	var layer = L.geoJSON(data.features, {
		style: { color: '#5C8590' },
		onEachFeature: onEachFeature
	})
	layer.addTo(map)
	map.fitBounds(layer.getBounds())
	callback(map, layer)
}


function onEachFeature(feature, layer) {
	layer.on({
		click: keep
	})
}

function keep(e) {
	if(e.target.options.color === '#5C8590') { e.target.setStyle({ color: '#E79D92' }) }
	else { e.target.setStyle({ color: '#5C8590' }) }
}


