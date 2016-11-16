exports.init = function(divId, conf, callback) {
	var html = ''
	if(conf.modif) { html = html + '<p class="small">Continue with edited collection</p>' }
	html = html 
		+ '<button id="add-csv">Add from CSV</button>'
		+ '<button id="rm">Remove properties</button>'

	document.getElementById(divId).innerHTML = html
	callback()
}
