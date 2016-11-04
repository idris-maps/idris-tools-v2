var pointArray = require('./point-array')

exports.fromFeature = function(feat) {
	var points = pointArray.fromFeature(feat)
	return getBbox(points)
}

exports.fromCollection = function(col) {
	var points = pointArray.fromCollection(col)
	return getBbox(points)
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
