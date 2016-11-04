module.exports = function(menu, index) {
	view(menu, index, function() {
		ctrl(menu, index)
	})
}

function view(menu, index, callback) {
	var layer = menu.map.layers[index]
	var html = '<h2>Choose property for label</h2>'
	+ '<select id="label-property">'
	layer.getProperties().forEach(function(prop) {
		html = html + '<option value="' + prop + '">' + prop + '</option>'
	})
	html = html + '</select>'
		+ '<button id="label-property-btn">OK</button>'
	menu.div.innerHTML = html
	callback()
}

function ctrl(menu, index) {
	document.getElementById('label-property-btn').onclick = function() {
		menu.map.switchPointType(index, document.getElementById('label-property').value)
		menu.close()
	}
}
