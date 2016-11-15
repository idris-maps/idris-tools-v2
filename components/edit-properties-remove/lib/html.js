exports.init = function(divId, props, callback) {
	var html = '<p><b>Choose properties</b></p>'
		+ '<div class="scroll-y">'
	props.forEach(function(p) {
		html = html + '<div class="checkbox-item">'
			+ '<input id="' + p + '" class="checkbox-input" type="checkbox">'
			+ '<span>' + p + '</span>'
		+ '</div>' 
	})
	html = html
		+ '</div>'
		+ '<button id="rm-selected">Remove selected</button>'
		+ '<button id="rm-unselected">Remove not selected</button>'
	document.getElementById(divId).innerHTML = html
	callback()
}

exports.done = function(divId, callback) {
	var html = '<p><b>Properties have been removed</b></p>'
		+ '<button id="save">Save collection</button>'
		+ '<button id="continue">Continue editing</button>'
	document.getElementById(divId).innerHTML = html
	callback()
}
