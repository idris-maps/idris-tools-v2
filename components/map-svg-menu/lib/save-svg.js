var save = require('../../utils/save')
module.exports = function(menu) {
	view(menu, function() {
		ctrl(menu)
	})
}

function view(menu, callback) {
	var canvas = menu.map.canvas
	var html = '<h2>Save as SVG</h2>'
		+ '<p>The size of the SVG will be:<br/>'
		+ '<b>width</b>: ' + canvas.width + '<br/>'
		+ '<b>height</b>: ' + canvas.height + '<br/>'
		+ '<button id="save-ok">OK</button>'
		+ '<button id="change-save-size">Change map size</button>'
	menu.div.innerHTML = html
	callback()
}

function ctrl(menu) {
	document.getElementById('save-ok').onclick = function() {
		save.svg('map.svg', svgString(menu.map.outerHTML()))
		menu.close()
	}
	document.getElementById('change-save-size').onclick = function() {
		menu.setMapSize()
	}
}
		
function svgString(html) {
	var end = html.substring(4)
	return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
		+ '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" ' + end
}
