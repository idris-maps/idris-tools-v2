var msg = require('./msg')

module.exports = function(name, geojson, callback) {
	var feats = geojson.features
	var types = {
		'points': [],
		'lines': [],
		'polygons': []
	}
	msg.write('Checking Geometries...')
	loop(0, feats, types, function(t) {
		callback(convert(name, t))
	})
}

function convert(name, types) {
	var pts = null
	var lin = null
	var pol = null
	var c = 0
	if(types.points.length !== 0) { pts = types.points; c = c + 1 }
	if(types.lines.length !== 0) { lin = types.lines; c = c + 1 }
	if(types.polygons.length !== 0) { pol = types.polygons; c = c + 1 }

	var arr = []
	if(c === 1) {
		if(pts) { arr.push(col('points', name, pts)) }
		else if(lin) { arr.push(col('lines', name, lin)) }
		else if(pol) { arr.push(col('polygons', name, pol)) }
	} else {
		if(pts) { arr.push(col('points', name + '-points', pts)) }
		if(lin) { arr.push(col('lines', name + '-lines', lin)) }
		if(pol) { arr.push(col('polygons', name + '-polygons', pol)) }
	}
	return arr
}

function col(type, name, feats) {
	return {type: type, name: name, collection: {type: 'FeatureCollection', features: feats}}
}

function loop(i, feats, types, callback) {
	if(i === feats.length) { callback(types) }
	else {
		var f = feats[i]
		var t = f.geometry.type
		if(t === 'Point' || t === 'MultiPoint') { types.points.push(f) }
		else if(t === 'LineString' || t === 'MultiLineString') { types.lines.push(t) }
		else if(t === 'Polygon' || t === 'MultiPolygon') { types.polygons.push(t) }
		if(i!== 0 && Math.floor(i/100) === i/100) {
			setTimeout(function() {
				msg.write('Checked ' + i + ' of ' + feats.length + ' geometries')
				loop(i+1, feats, types, callback)
			},1)
		} else {
			loop(i+1, feats, types, callback)
		}
	}
}
