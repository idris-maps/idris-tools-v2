module.exports = function(map, position) {
	var o = this
	if(position) { o.position = position } else { o.position = 'topright' }
	var btn = L.Control.extend({
		options: {
		  position: 'topright'
		},
		onAdd: function(map) {
		 var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
			initContainerStyle(container)
			o.container = container
			return container
		}
	})
	o.map = map
	o.btn = new btn()

// VISIBILITY
	o.shown = false
	o.show = function() {
		o.map.addControl(o.btn)
		o.shown = true
	}
	o.hide = function() {
		o.map.removeControl(o.btn)
		o.shown = false
	}
	o.toggle = function() {
		if(o.shown) { o.hide() } else { o.show() }
	}

// CONTENT
	o.setCtrl = function(fn) {
		fn()
	}
	o.setHTML = function(html) {
		o.container.innerHTML = html
	}
	o.setHTMLcb = function(html, callback) {
		o.container.innerHTML = html
		callback()
	}
	o.setContent = function(html, fn, style) {
		o.show()
		o.setHTMLcb(html, function() {
			if(fn) { o.setCtrl(fn) }
			if(style) { o.setStyle(style) }
		})	
	}

	o.setStyle = function(style) {
		setContainerStyle(o.container, style)
	}
}

function setContainerStyle(container, style) {
	if(style) {
		for(k in style) {
			container.style[k] = style[k]
		}
	}
}

function initContainerStyle(container) {
	container.style.backgroundColor = 'white'    
	container.style.width = '100%'
	container.style.height = '100%'
}
