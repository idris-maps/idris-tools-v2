var distance = require('turf-distance')

module.exports = function(data, callback) {
	loop(0, data, 0, [], function(totalDist, withDist) {
		callback({total: totalDist, points: withDist})
	})
}

function loop(i, pts, totalDist, withDist, callback) {
	if(i === pts.length) { callback(totalDist, withDist) }
	else if(i === 0) {
		var wd = pts[i]
		wd.dist = 0 
		withDist.push(wd) 
		loop(i+1, pts, totalDist, withDist, callback)
	} else {
		var prev = pts[i-1]
		var wd = pts[i]
		var dist = distance(feature(prev), feature(wd), 'kilometers')
		totalDist = totalDist + dist
		wd.dist = totalDist
		withDist.push(wd)
		if(Math.floor(i/100) === i/100) {
			setTimeout(function() {
				loop(i+1, pts, totalDist, withDist, callback)
			},1)
		} else {
			loop(i+1, pts, totalDist, withDist, callback)
		}
	}
}


function feature(d) {
	return {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Point',
			coordinates: [d.lon, d.lat]
		}
	}
}
