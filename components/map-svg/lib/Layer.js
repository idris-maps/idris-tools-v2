var style = require('./style-defaults')
var draw = require('./draw')
var geo = require('../../utils/geo')

module.exports = function(conf) {
	var o = this
	init(o, conf)
	o.outerHTML = function(projection, path) {
		return drawLayer(o, projection, path)
	}
	o.setLayerStyle = function(obj) {
		for(k in obj) {
			o.style[k] = obj[k]
		}
	}
	o.addStyleByFeature = function(obj) {
		o.styleByFeat.push(obj)
	}
	o.removeStyleByFeature = function(index) {
		o.styleByFeat.splice(index, 1)
	}

	o.switchPointType = function(property) {
		if(o.type === 'point') {
				o.type = 'label'
				o.style = style.label()
				o.labelProperty = property
		} else if(o.type === 'label') {
			o.type = 'point'
			o.style = style.point()
			o.labelProperty = undefined
		}
	}

	o.getProperties = function() {
		return geo.getAllProperties(o.feats)
	}
	o.getPropertyValues = function(property) {
		return geo.getPropertyValues(o.feats, property)
	}
	o.getUniqPropertyValues = function(property) {
		return geo.getUniqPropertyValues(o.feats, property)
	}
	o.propertyIsNumeric = function(property) {
		return geo.numericValues(o.feats, property)
	}

	o.getLayerStyle = function() { return o.style }
	o.getStyleByFeature = function() { return o.styleByFeat }
	o.getData = function() {
		var obj = {
			type: o.type,
			name: o.name,
			data: {type: 'FeatureCollection', features: o.feats},
			style: {
				layer: o.style,
				byFeature: o.styleByFeat
			}
		}
		if(o.type === 'label') { obj.property = o.labelProperty }
		return obj
	}
}

function drawLayer(o, projection, path) {
	if(o.type === 'point') { 
		var inner = draw.points(o, projection)
	} else if(o.type === 'label') {
		var inner = draw.label(o, projection) 
	} else { var inner = draw.other(o, path) }
	var g = '<g id="' + o.name + '" '
	for(k in o.style) {
		if(k !== 'r') {
			g = g + k + '="' + o.style[k] + '" '
		}
	}
	return g + '>' + inner + '</g>'
}

function init(o, conf) {
	o.name = conf.name
	if(conf.type && checkType(conf.type)) { o.type = conf.type }
	if(o.type === 'point') { o.style = style.point() }
	else if(o.type === 'label') { o.style = style.label(); o.labelProperty = conf.property }
	else if(o.type === 'line') { o.style = style.line() }
	else { o.style = style.polygon() }
	o.styleByFeat = []
	if(conf.style) {
		if(conf.style.layer) {
			for(k in conf.style.layer) { o.style[k] = conf.style.layer[k] }
		}
		if(conf.style.byFeature) { 
			o.styleByFeat = conf.style.byFeature 
		}
	}
	if(conf.data && checkData(conf.data)) { o.feats = conf.data.features }
}

function checkType(type) {
	if(type === 'point' || type === 'label' || type === 'line' || type === 'polygon') { return true }
	else {
		console.log('Layer type \"' + type + '\" is not valid, use \"point\", \"label\", \"line\" or \"polygon\"')
		return false
	}
}

function checkData(data) {
	if(data.type === 'FeatureCollection' && data.features.length !== 0) { return true }
	else {
		console.log('Layer data must be a GeoJSON FeatureCollection')
		return false
	}
}
