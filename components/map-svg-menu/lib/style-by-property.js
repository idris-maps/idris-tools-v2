module.exports = function(menu, index) {
	view(menu, index, function() {
		ctrl(menu, index)
	})
	
}

function view(menu, index, callback) {
	var html = '<h2>Style by property</h2>'
	+ '<p><b>Choose property</b></p>'
	+ '<select id="property-to-style-after">'
		+ viewPropertyOptions(menu, index)
	+ '</select>'
	+ '<p><b>Choose what to style</b></p>'
	+ '<select id="style-property">'
		+ viewStyleOptions(menu, index)
	+ '</select>'
	+ '<button id="property-to-style-btn">OK</button>'
	menu.div.innerHTML = html
	callback()
} 

function viewPropertyOptions(menu, index) {
	var html = ''
	var properties = menu.map.layers[index].getProperties()
	properties.forEach(function(p) {
		html = html + '<option value="' + p + '">' + p + '</option>'
	})
	return html
}

function viewStyleOptions(menu, index) {
	var html = ''
	var layer = menu.map.layers[index].style
	var styles = []
	for(k in layer) { styles.push(k) }
	styles.forEach(function(s) {
		html = html + '<option value="' + s + '">' + s + '</option>'
	})
	return html
}

function ctrl(menu, index) {
	document.getElementById('property-to-style-btn').onclick = function() {
		var prop = document.getElementById('property-to-style-after').value
		var styleType = document.getElementById('style-property').value
		var sbp = { property: prop, type: styleType }
		if(menu.map.layers[index].propertyIsNumeric(prop)) {
			menu.styleByPropertyNum(index, sbp)
		} else {
			menu.styleByPropertyManual(index, sbp)
		}
	}
}
