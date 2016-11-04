module.exports = function(data, callback) {
	var feats = []
	data.forEach(function(d,i) {
		var f = featureDefault()
		if(d.ele) { f.properties.ele = d.ele }
		if(d.time) { f.properties.time = d.time }
		f.geometry = {
			type: 'Point',
			coordinates: [d.lon, d.lat]
		}
		feats.push(f)
	})
	callback({type: 'FeatureCollection', features: feats})
}

function featureDefault() {
	return {
			type: 'Feature',
			properties: {},
			geometry: {}
	}
}



