var getProj = require('./lib/get-projection')
var Layer = require('./lib/Layer')

module.exports = function(bbox, canvas) {
	var o = this
	o.bbox = fixBbox(bbox)
	o.canvas = canvas
	setProj(o)
	o.changeBbox = function(newBbox) {
		o.bbox = fixBbox(newBbox)
		setProj(o)
		o.redraw()
	}
	o.changeCanvas = function(newCanvas) {
		o.canvas = newCanvas
		setProj(o)
		o.redraw()
	}
	o.layers = []
	o.addLayer = function(config) {
		var layer = new Layer(config)
		o.layers.push(layer)
		o.redraw()
	}
	o.removeLayer = function(index) {
		o.layers.splice(index, 1)
		o.redraw()
	}

	o.outerHTML = function() {
		var svg = '<svg width="' + o.canvas.width + '" height="' + o.canvas.height + '">'
		o.layers.forEach(function(layer) {
			svg = svg + layer.outerHTML(o.projection, o.path)
		})
		svg = svg + '</svg>'
		return svg
	}

	o.rendered = false
	o.render = function(divId) {
		o.renderDivId = divId
		var div = document.getElementById(divId)
		div.innerHTML = o.outerHTML()
		o.rendered = true
	}
	o.redraw = function() {
		if(o.rendered) { o.render(o.renderDivId) }
	}
	o.destroy = function() {
		if(o.rendered) {
			var div = document.getElementById(o.renderDivId)
			while (div.firstChild) { div.removeChild(div.firstChild) }	
			o.rendered = false
		}
	}

	o.setLayerStyle = function(index, obj) { o.layers[index].setLayerStyle(obj); o.redraw() }
	o.addStyleByFeature = function(index, obj) { o.layers[index].addStyleByFeature(obj); o.redraw() }
	o.removeStyleByFeature = function(index, sbpIndex) { o.layers[index].removeStyleByFeature(sbpIndex); o.redraw() }
	o.switchPointType = function(index, property) { o.layers[index].switchPointType(property); o.redraw() }

	o.getLayerProperties = function(index) { return o.layers[index].getProperties() }
	o.getLayerPropertyValues = function(index, property) { return o.layers[index].getPropertyValues(property) }
	o.getLayerUniqPropertyValues = function(index, property) { return o.layers[index].getUniqPropertyValues(property) }
	o.layerPropertyIsNumeric = function(index, property) { return o.layers[index].propertyIsNumeric(property) }
	o.getLayersData = function() {
		var r = []
		o.layers.forEach(function(l) {
			r.push(l.getData())
		})
		return r
	}
}

function setProj(o) {
	var p = getProj.fromBbox(o.bbox, o.canvas)
	o.projection = p.projection
	o.path = p.path
}

function fixBbox(bbox) {
	if(bbox[0] < -179) { bbox[0] = -179 }
	if(bbox[1] < -85) { bbox[1] = -85 }
	if(bbox[2] > 179) { bbox[2] = 179 }
	if(bbox[3] > 85) { bbox[3] = 85 }
	return bbox
}


