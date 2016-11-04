module.exports = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<p>Paste data with lat/lng columns or a WKT column</p>'
		+ '<textarea id="paste-area"></textarea>'
		+ '<br/>'
		+ '<button id="paste-done">Done</button>'
		+ '<p id="paste-error"></p>'
	callback()
}
