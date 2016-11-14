var img = require('./bbox-img.json')

exports.choose = function(config, callback) {
	
	var html = '<p><b>Get features</b></p>'
		+ '<div class="bbox-img"><img src="data:image/png;base64,' + img.within + '" alt="Within bounding box" /></div>'
		+ '<button id="within-bbox">Within bounding box</button>'
		+ '<div class="bbox-img"><img src="data:image/png;base64,' + img.crop + '" alt="Cropped to bounding box" /></div>'
		+ '<button id="crop-bbox">Cropped to bounding box</button>'
		+ '<div class="bbox-img"><img src="data:image/png;base64,' + img.intersect + '" alt="Intersecting bounding box" /></div>'
		+ '<button id="intersect-bbox">Intersecting bounding box</button>'

	document.getElementById(config.divId).innerHTML = html
	callback()
}

exports.bbox = function(config, callback) {

	var html = '<p><b>Choose the bounding box</b></p>'
		+ '<p id="err"></p>'
		+ '<p>Minimum longitude</p>'
		+ '<input id="min-lon" placeholder="Minimum longitude" type="number" />'
		+ '<p>Minimum latitude</p>'
		+ '<input id="min-lat" placeholder="Minimum latitude" type="number" />'
		+ '<p>Maximum longitude</p>'
		+ '<input id="max-lon" placeholder="Maximum longitude" type="number" />'
		+ '<p>Maximum latitude</p>'
		+ '<input id="max-lat" placeholder="Maximum latitude" type="number" />'
		+ '<button id="bbox-btn">OK</button>'

	document.getElementById(config.divId).innerHTML = html
	callback()
}

exports.processing = function(config, callback) {

	var html = '<p><b>Processing...</b></p>'
		+ '<p id="progress"></p>'	

	document.getElementById(config.divId).innerHTML = html
	callback()
}
