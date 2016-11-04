module.exports = function(menu, index, sbp) {
	view(menu, index, sbp, function(layerStyleValue) {
		ctrl(menu, index, sbp, layerStyleValue)
	})
}

function view(menu, index, sbp, callback) {
	var layerStyleValue = menu.map.layers[index].style[sbp.type]
	var propertyValues = menu.map.layers[index].getUniqPropertyValues(sbp.property)
	var html = '<h2>"' + sbp.type + '" by "' + sbp.property + '"</h2>'
	propertyValues.forEach(function(p) {
		html = html + '<div class="sbp-item">'
			+ '<p class="sbp-item-label">' + p + '</p>'
			+ '<input class="sbp-item-input" id="sbp-item-input-' + p + '" value="' + layerStyleValue + '">'
		+ '</div>'
	})
	html = html + '<button id="sbp-submit">Done</button>'
	menu.div.innerHTML = html
	callback(layerStyleValue)
}

function ctrl(menu, index, sbp, layerStyleValue) {
	var inputs = document.getElementsByClassName('sbp-item-input')
	document.getElementById('sbp-submit').onclick = function() {
		var style = getDataFromForm(inputs, sbp, layerStyleValue)
		menu.map.addStyleByFeature(index, style)
		menu.close()
	}
}

function getDataFromForm(inputs, sbp, layerStyleValue) {
	var d = []
	for(i=0;i<inputs.length;i++) {
		var inp = inputs[i]
		d.push({propValue: inp.id.split('sbp-item-input-')[1], styleValue: inp.value})
	}
	return cleanDataFromForm(d, sbp, layerStyleValue)
}

function cleanDataFromForm(d, sbp, layerStyleValue) {
	var r = {
		property: sbp.property,
		type: sbp.type,
		data: []
	}
	d.forEach(function(s) {
		if(s.styleValue !== layerStyleValue) { r.data.push(s) }
	})
	return r
}
