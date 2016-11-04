exports.equal = function(rule, obj) {
	rule.feats.forEach(function(f) {
		if(f.properties[rule.property] === obj.propValue) {
			pushOrOverride(rule.data, f.properties[rule.property], obj.styleValue)
		}
	})
}

exports.greater = function(rule, obj) {
	rule.feats.forEach(function(f) {
		if(f.properties[rule.property] > obj.propValue) {
			pushOrOverride(rule.data, f.properties[rule.property], obj.styleValue)
		}
	})
}

exports.greaterOrEqual = function(rule, obj) {
	rule.feats.forEach(function(f) {
		if(f.properties[rule.property] >= obj.propValue) {
			pushOrOverride(rule.data, f.properties[rule.property], obj.styleValue)
		}
	})
}

exports.less = function(rule, obj) {
	rule.feats.forEach(function(f) {
		if(f.properties[rule.property] < obj.propValue) {
			pushOrOverride(rule.data, f.properties[rule.property], obj.styleValue)
		}
	})
}

exports.lessOrEqual = function(rule, obj) {
	rule.feats.forEach(function(f) {
		if(f.properties[rule.property] <= obj.propValue) {
			pushOrOverride(rule.data, f.properties[rule.property], obj.styleValue)
		}
	})
}

function pushOrOverride(array, propValue, styleValue) {
	var exists = false
	array.forEach(function(x) {
		if(x.propValue === propValue) { x.styleValue = styleValue; exists = true }
	})
	if(!exists) { array.push({propValue: propValue, styleValue: styleValue}) }
}
