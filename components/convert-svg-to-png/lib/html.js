exports.init = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<div id="canvas-div" style="display:none"><canvas id="canvas" width="1" height="1"></canvas></div>'
	callback()
}

exports.cannot = function() {
		var el = document.getElementById('btn-div')
	el.innerHTML = '<p>SVG could not be parsed</p>'
}
