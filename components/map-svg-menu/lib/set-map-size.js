module.exports = function(menu) {
	view(menu, function(canvas) {
		ctrl(menu, canvas)
	})
}

function view(menu, callback) {
	var canvas = menu.map.canvas
	var html = '<h2>Set map size</h2>'
		+ '<p><b>Width</b></p>'
		+ '<input id="map-size-width" value="' + canvas.width + '" type="number" />'
		+ '<p><b>Height</b></p>'
		+ '<input id="map-size-height" value="' + canvas.height + '" type="number" />'
		+ '<button id="map-size-btn">OK</button>'
	menu.div.innerHTML = html
	callback(canvas)
}

function ctrl(menu, prevCanvas) {
	document.getElementById('map-size-btn').onclick = function() {
		var w = document.getElementById('map-size-width').value
		var h = document.getElementById('map-size-height').value
		if(!isNaN(w) && !isNaN(h)) {
			if(+w !== prevCanvas.width || +h !== prevCanvas.height) {
				menu.map.changeCanvas({width: +w, height: +h})
				menu.close()
			} else {
				menu.close()
			}
		}
	}
}
