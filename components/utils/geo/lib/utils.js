exports.isGeom = function(geometry) {
	var r = false
	var types = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']
	types.forEach(function(t) {
		if(geometry.type === t) { r = true }
	})
	return r
}

exports.uniq = function(arr) {
	var uniq = []
	arr.forEach(function(val) {
		var exist = false
		uniq.forEach(function(uVal) {
			if(val === uVal) { exist = true }
		})
		if(!exist) { uniq.push(val) }
	})
	uniq.sort()
	return uniq
}

