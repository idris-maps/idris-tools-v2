var img = require('./img.json')

exports.draw = '<p><b>Draw a bounding box</b><br/>'
	+ '<span id="info">Double click to start drawing</span></p>'

exports.type = ''
	+ '<div class="l-img-c">'
		+ '<img id="within" class="l-img" src="data:image/png;base64,' + img.within + '" alt="Within">'
	+ '</div>'
	+ '<div class="l-img-c">'
		+ '<img id="crop" class="l-img" src="data:image/png;base64,' + img.crop + '" alt="Crop">'
	+ '</div>'
	+ '<div class="l-img-c">'
		+ '<img id="intersect" class="l-img" src="data:image/png;base64,' + img.intersect + '" alt="Intersect">'
	+ '</div>'
	+ '<div class="l-img-c">'
	+ '<hr/>'
	+ '<br/><div class="l-img-c">'
		+ '<img id="redraw" class="l-img-sm" src="data:image/png;base64,' + img.draw + '" alt="redraw">'
	+ '</div><br/>'

exports.process = '<p><b>Processing</b><br/>'
	+ '<span id="progress">...</span>'

