var util = require('./utils')

exports.getAll = function(feats) {
	var props = []
	for(k in feats[0].properties) { props.push(k) }
	return props
}

exports.getValues = function(feats, property) {
	var vals = []
	feats.forEach(function(f) {
		vals.push(f.properties[property])
	})
	return vals.sort(function(a,b) {return a - b })
}

exports.getUniqValues = function(feats, property) {
	var vals = []
	feats.forEach(function(f) {
		vals.push(f.properties[property])
	})
	return util.uniq(vals)
}

exports.numericValues = function(feats, property) {
	var r = true
	feats.forEach(function(f) {
		if(f.properties[property]) {
			if(isNaN(f.properties[property])) { r = false }
		}
	})
	return r
}

