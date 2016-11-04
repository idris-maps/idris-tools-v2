function median(values) {
	values.sort(function(a,b) {return a - b })
	var half = Math.floor(values.length/2)
 if(values.length % 2) { return values[half] }
 else { return (values[half-1] + values[half]) / 2.0 }
}
exports.median = function(values) { return median(values) }

function sum(values) {
	var r = 0
	values.forEach(function(v) {
		if(!isNaN(v)) { r = r + v }
	})
	return r
}
exports.sum = function(values) { return sum(values) }

function mean(values) {
	var total = sum(values)
	return total/values.length
}
exports.mean = function(values) { return mean(values) }

function minMax(values) {
	var o = {max: -Infinity, min: Infinity}
	values.forEach(function(v) {
		if(!isNaN(v)) {
			if(v > o.max) { o.max = v }
			if(v < o.min) { o.min = v }
		}
	})
	return o
}
exports.minMax = function(values) { return minMax(values) }


