exports.points = function(o, projection) {
	var feats = separateMultiPoint(o.feats)
	var str = ''
	feats.forEach(function(f) {
		var r = o.style.r
		var styleString = ''
		if(o.styleByFeat) {
			o.styleByFeat.forEach(function(featStyle) {
				featStyle.data.forEach(function(s) {
					if(f.properties[featStyle.property] === s.propValue) {
						if(featStyle.type === 'r') { r = s.styleValue }
						else { styleString = styleString + featStyle.type + '="' + s.styleValue + '" ' }
					}
				})
			})
		}
		var pos = projection(f.geometry.coordinates)
		str = str + '<circle cx="' + pos[0] + '" cy="' + pos[1] + '" r="' + r + '" ' + styleString + ' ></circle>'
	})
	return str
}

exports.label = function(o, projection) {
	var feats = separateMultiPoint(o.feats)
	var str = ''
	feats.forEach(function(f) {
		var styleString = ''
		if(o.styleByFeat) {
			o.styleByFeat.forEach(function(featStyle) {
				featStyle.data.forEach(function(s) {
					if(f.properties[featStyle.property] === s.propValue) {
						styleString = styleString + featStyle.type + '="' + s.styleValue + '" ' 
					}
				})
			})
		}
		var pos = projection(f.geometry.coordinates)
		var text = f.properties[o.labelProperty]
		str = str + '<text x="' + pos[0] + '" y="' + pos[1] + '" ' + styleString + ' >' + text + '</text>'
	})
	return str
}

exports.other = function(o, path) {
	var feats = ensureGeoType(o.feats)
	var str = ''
	feats.forEach(function(f) {
		str = str + '<path d="' + path(f) + '" '
		if(o.styleByFeat) {
			o.styleByFeat.forEach(function(featStyle) {
				featStyle.data.forEach(function(s) {
					if(f.properties[featStyle.property] === s.propValue) {
						str = str + featStyle.type + '="' + s.styleValue + '" '
					}
				})
			})
		}
		str = str + '></path>'
	})
	return str
}

function separateMultiPoint(feats) {
	var pointFeatures = []
	feats.forEach(function(f) {
		var t = f.geometry.type
		if(t === 'Point') { pointFeatures.push(f) }
		else if(t === 'MultiPoint') {
			var p = f.properties
			var c = f.geometry.coordinates
			c.forEach(function(pt) {
				pointFeatures.push({
					type: 'Feature',
					properties: p,
					geometry: { type: 'Point', coordinates: pt }
				})
			})
		}
	})
	return pointFeatures
}

function ensureGeoType(feats) {
	var ok = []
	feats.forEach(function(f) {
		var t = f.geometry.type
		if(t === 'LineString' || t === 'MultiLineString' || t === 'Polygon' || t === 'MultiPolygon') {
			ok.push(f)
		}
	})
	return ok
}
