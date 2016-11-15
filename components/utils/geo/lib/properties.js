var util = require('./utils')

exports.getAll = function(feats) { return getAll(feats) }

function getAll(feats) {
	var props = []
	for(k in feats[0].properties) { props.push(k) }
	return props
}

exports.getValues = function(feats, property) { return getValues(feats, property) }

function getValues(feats, property) {
	var vals = []
	feats.forEach(function(f) {
		vals.push(f.properties[property])
	})
	return vals.sort(function(a,b) {return a - b })
}

exports.getUniqValues = function(feats, property) { return getUniqValues(feats, property) }

function getUniqValues(feats, property) {
	var vals = []
	feats.forEach(function(f) {
		vals.push(f.properties[property])
	})
	return util.uniq(vals)
}

exports.numericValues = function(feats, property) { return numericValues(feats, property) }

function numericValues(feats, property) {
	var r = true
	feats.forEach(function(f) {
		if(f.properties[property]) {
			if(isNaN(f.properties[property])) { r = false }
		}
	})
	return r
}

exports.propInfo = function(feats) {
	var properties = []
	var props = geo.getAllProperties(o.feats)
	props.forEach(function(prop) {
		var obj = {
			key: prop,
			uniqValues: getUniqValues(o.feats, prop),
			isNum: numericValues(o.feats, prop)
		}
		obj.maxValue = obj.uniqValues[0]
		obj.minValue = obj.uniqValues[obj.uniqValues.length - 1]
		obj.nbUniqValues = obj.uniqValues.length

		properties.push(obj)
	})
	return properties
}


