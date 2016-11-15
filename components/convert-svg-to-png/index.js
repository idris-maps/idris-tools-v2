var html = require('./lib/html')
var canvg = require('canvg-browser')
var save = require('../utils/save')

module.exports = function(divId, img, callback) {
	html.init(divId, function() {
		var opt = {
			ignoreMouse: true,
			ignoreAnimation: true
		}
		var c = document.getElementById('canvas')
		canvg(c, img.svg, opt)
		if(c.width !== 1 && c.height !== 1) {
			download(c, img, function() { callback() })
		} else {
			html.cannot()
		}
	})
}

function download(c, img, callback) {
	c.toBlob(function(blob) {
		save.blob(img.name + '.png', blob)
		callback()
	})
}

