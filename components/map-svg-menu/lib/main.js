module.exports = function(menu) {
	view(menu, function() {
		ctrl(menu)
	})	
}

function view(menu, callback) {
	var html = '<button id="add-layer">Add layer</button>'
		+ '<button id="set-map-size">Set map size</button>'
		+ '<button id="set-map-bbox">Set bounding box</button>'
		+ '<button id="download-map">Download map</button>'
		+ '<h2>Layers</h2>'
		+ '<div id="layer-list">'
	menu.map.layers.forEach(function(l, i) {
		html = html + '<div class="layer-item">'
			+ l.name
		+ '</div>'
	})
	html = html + '</div>'
	menu.div.innerHTML = html
	callback()
}

function ctrl(menu) {
	var select = document.getElementsByClassName('layer-item')
	var items = []
	for(i=0;i<select.length;i++) { items.push(select[i]) }
	items.forEach(function(item, index) {
		item.onclick = function() {
			menu.layer(index)
		}
	})

	document.getElementById('add-layer').onclick = function() {
		menu.addLayer()
	}
	document.getElementById('set-map-size').onclick = function() {
		menu.setMapSize()
	}
	document.getElementById('set-map-bbox').onclick = function() {
		menu.setMapBbox()
	}
	document.getElementById('download-map').onclick = function() {
		menu.saveSvg()
	}
}

