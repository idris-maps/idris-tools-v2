exports.init = function(c, callback) {
	var html = '<p><b>Choose property</b></p>'
		+ '<select id="select-prop">'
	c.props.forEach(function(p) {
		html = html + '<option value="' + p + '">' + p + '</option>'
	})
	html = html + '</select>'
		+ '<button id="btn-prop">OK</button>'
	
	document.getElementById(c.divId).innerHTML = html
	callback()
}

exports.notNum = function(c, callback) {
	var html = '<p><b>Select values</b></p>'
		+ '<div class="scroll-y">'
	c.values.forEach(function(v) {
		html = html + '<div class="checkbox-item">'
			+ '<input id="' + v + '" class="checkbox-input" type="checkbox">'
			+ '<span>' + v + '</span>'
		+ '</div>' 
	})
	html = html + '</div>'
		+ '<button id="get-checked">Use selected values</button>'
		+ '<button id="get-not-checked">Use unselected values</button>'

	document.getElementById(c.divId).innerHTML = html
	callback()
}

exports.num = function(c, callback) { 
	var html = '<p><b>Get features</b></p>'
		+ '<p>where ' + c.prop + '</p>'
		+ '<select id="operator">'
			+ '<option value="<"> is less than</option>'
			+ '<option value="<="> is less or equal to</option>'
			+ '<option value="="> is equal to</option>'
			+ '<option value=">="> is greater or equal to</option>'
			+ '<option value=">"> is greater than</option>'
		+ '</select>'
		+ '<input id="value" type="number" placeholder="value">'
		+ '<button id="by-rule-btn">OK</button>'

	document.getElementById(c.divId).innerHTML = html
	callback()
}
