var getAllPoints = require('./get-all-points')

exports.fromFeature = function(feat) {
	return getBbox(getAllPoints.fromFeature(feat))
}

exports.fromFeatureCollection = function(col) {
	return getBbox(getAllPoints.fromFeatureCollection(col))
}

exports.fromGeometry = function(geom) {
	return getBbox(getAllPoints.fromGeometry(geom))
}

function getBbox(points) {
	var x = { min: Infinity, max: -Infinity }
	var y = { min: Infinity, max: -Infinity }
	points.forEach(function(pt) {
		if(pt[0] > x.max) { x.max = pt[0] }
		if(pt[0] < x.min) { x.min = pt[0] }
		if(pt[1] > y.max) { y.max = pt[1] }
		if(pt[1] < y.min) { y.min = pt[1] }
	})
	return [x.min, y.min, x.max, y.max]
}
