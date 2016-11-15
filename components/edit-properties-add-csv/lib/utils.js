exports.checkParsed = function(evt, parsed) {
	if(parsed.errors.length > 0) {
		evt.emit('parse-errors', parsed.errors)
	} else {
		evt.emit('parse-success', parsed.data)
	}
}

exports.csvToJson = function(head, lines) {
	var arr = []
	lines.forEach(function(l) {
		var obj = {}
		l.forEach(function(v, vI) {
			obj[head[vI]] = v
		})
		arr.push(obj)
	})
	return arr
}

exports.joinThem = function(evt, feats, csvJson, joiner) {
	var newFeats = []
	feats.forEach(function(f) {
		var line = findLine(f, csvJson, joiner)
		newFeats.push(addProps(f, line))
	})
	evt.emit('joined', {type: 'FeatureCollection', features: newFeats})
}

function findLine(f, csvJson, joiner) {
	var val = f.properties[joiner.geo]
	var num = !isNaN(val)
	var r = null
	csvJson.forEach(function(csv) {
		if(num) { if(+csv[joiner.csv] === +val) { r = csv } } 
		else { if(csv[joiner.csv] === val) { r = csv } }
	})
	return r
}

function addProps(f, line) {
	for(k in line) {
		f.properties[k] = line[k]
	}
	return f
}
