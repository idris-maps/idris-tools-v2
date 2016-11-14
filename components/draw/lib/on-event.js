exports.onDrawCreated = function(e, o) {
	var layer = e.layer
	o.drawn.addLayer(layer)
	o.data.addGeom(e)
	o.dlBtn.show()
	if(o.data.propKeys.length !== 0) {
		var html = '<b>Add properties</b>'
		o.data.propKeys.forEach(function(p) {
			html = html + '<br/><input class="props-input" id="' + p + '" placeholder="key: ' + p + '">'
		})
		html = html + '<br/><button id="add-props">OK</button>'
		layer.bindPopup(html).openPopup()
		document.getElementById('add-props').onclick = function() {
			var inputs = document.getElementsByClassName('props-input')
			for(i=0;i<inputs.length;i++) {
				o.data.addProperty(layer._leaflet_id, inputs[i].id, inputs[i].value)
			}
			layer.closePopup()
		}
	}
}

exports.onDrawnClick = function(e, o) {
	var props = o.data.getProperties(e.layer._leaflet_id)
	var html = '<b>Properties</b>'
	props.forEach(function(p) {
		html = html + '<br/><b>' + p.key + '</b>: ' + p.value
	})
	html = html + '<br/><button id="add-property">Add property</button>'
	e.layer.bindPopup(html).openPopup()
	document.getElementById('add-property').onclick = function() {
		var form = '<b>Add property</b>'
				+ '<input id="key" placeholder="key">'
				+ '<input id="value" placeholder="value">'
				+ '<br/><button id="add-property-form">OK</button>'
		e.layer.bindPopup(form)
		document.getElementById('add-property-form').onclick = function() {
			if(document.getElementById('key').value && document.getElementById('value').value) {
				o.data.addProperty(e.layer._leaflet_id, document.getElementById('key').value, document.getElementById('value').value)
			}
			e.layer.closePopup()
		}
	}
} 
