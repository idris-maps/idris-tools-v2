var d3 = require('d3-geo')

exports.fromCollection = function(data, canvas) {
	return getProj(data, canvas)
}

exports.fromBbox = function(bbox, canvas) {
	return getProj(bboxToCol(bbox), canvas)
}

function getProj(data, canvas) {
	var projection = d3.geoMercator().scale(1).translate([0, 0])
	var path = d3.geoPath().projection(projection)
	var b = path.bounds(data)
	var s = .95 /Math.max((b[1][0] - b[0][0]) /canvas.width, (b[1][1] - b[0][1]) /canvas.height)
	var t = [(canvas.width - s * (b[1][0] + b[0][0])) /2, (canvas.height - s * (b[1][1] + b[0][1])) /2]
	projection.scale(s).translate(t)

	return {
		projection: projection,
		path: path
	}
}

function bboxToCol(bbox) {
	return {
		type: 'FeatureCollection',
		features: [
			{type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates: [bbox[0], bbox[1]]}},
			{type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates: [bbox[2], bbox[3]]}}
		]
	}
}
