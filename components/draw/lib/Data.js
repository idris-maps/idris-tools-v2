module.exports = function() {
	var o = this
	o.id = 0
	o.propKeys = []
	o.properties = {}
	o.addGeom = function(obj) {
		o.id = o.id + 1
		o.properties[obj.layer._leaflet_id] = { id: o.id, layerType: obj.layerType }
	}

	o.addProperty = function(leafletId, key, value) {
		if(!isNaN(value)) { value = +value }
		o.properties[leafletId][key] = value
		var exist = false
		o.propKeys.forEach(function(pk) {
			if(pk === key) { exist = true }
		})
		if(!exist) { o.propKeys.push(key) }
	}
	o.getProperties = function(leafletId) {
		var props = []
		for(k in o.properties[leafletId]) {
			props.push({ key: k, value: o.properties[leafletId][k] })
		}
		return props
	}
	o.toGeoJSON = function(drawn) {
		var features = []
		for(k in drawn._layers) {
			var f = {
				type: 'Feature',
				properties: o.properties[k],
				geometry: toGeom(o.properties[k].layerType, drawn._layers[k])
			}
			features.push(f)
		}
		return {type: 'FeatureCollection', features: features}
	} 
}

function toGeom(type, layer) {
	if(type === 'rectangle') { 
		var t = 'Polygon'
		var cc = []
		layer._latlngs[0].forEach(function(p) { cc.push([p.lng, p.lat]) })
		cc.push([layer._latlngs[0][0].lng, layer._latlngs[0][0].lat])
		var c = [cc]
	} else if(type === 'polygon') {  
		var t = 'Polygon'
		var cc = []
		layer._latlngs[0].forEach(function(p) { cc.push([p.lng, p.lat]) })
		cc.push([layer._latlngs[0][0].lng, layer._latlngs[0][0].lat])
		var c = [cc]
	} else if(type === 'polyline') {
		var t = 'LineString'
		var c = []
		layer._latlngs.forEach(function(p) { c.push([p.lng, p.lat]) })
	} else if(type === 'marker') { 
		var t = 'Point'
		var c = [layer._latlng.lng, layer._latlng.lat] 
	}
	return {
		type: t,
		coordinates: c
	}
}
