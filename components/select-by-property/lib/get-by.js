exports.values = function(c) {
	var toKeep = []
	c.feats.forEach(function(f) {
		var v = f.properties[c.prop]
		if(isIn(v, c.values)) {
			toKeep.push(f)
		}
	})
	return col(toKeep)
}

exports.rule = function(c) {
	var toKeep = []
	c.feats.forEach(function(f) {
		var v = f.properties[c.prop]
		if(c.rule.operator === '<') { if(v < c.rule.value) { toKeep.push(f) } }
		else if(c.rule.operator === '<=') { if(v <= c.rule.value) { toKeep.push(f) } }
		else if(c.rule.operator === '=') { if(v === c.rule.value) { toKeep.push(f) } }
		else if(c.rule.operator === '>=') { if(v >= c.rule.value) { toKeep.push(f) } }
		else if(c.rule.operator === '>') { if(v > c.rule.value) { toKeep.push(f) } }
	})
	return col(toKeep)
}

function isIn(val, vals) {
	var r = false 
	vals.forEach(function(v) {
		if(v === val) { r = true }	
	})
	return r
}


function col(feats) {
	return {type: 'FeatureCollection', features: feats}
}
