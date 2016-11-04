module.exports = function(data, callback) {
	var pts0 = []
	var maxEle = -Infinity
	var minEle = Infinity

	data.points.forEach(function(d) {
		pts0.push({dist: Math.floor(d.dist * 1000), ele: d.ele})
		if(d.ele > maxEle) { maxEle = d.ele }
		if(d.ele < minEle) { minEle = d.ele }
	})

	var pts = []
	pts0.forEach(function(p) {
		p.eleFromBottom = p.ele - minEle
		pts.push(p)
	})

	var o = {
		points: pts,
		ele: { max: maxEle, min: minEle, diff: maxEle-minEle },
		distance: Math.floor(data.total * 1000)
	}

	callback(o)
}
