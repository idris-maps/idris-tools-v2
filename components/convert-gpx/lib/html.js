exports.init = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<b>Save as...</b>'
		+ '<button id="gpx-to-gj-points">Points</button>'
		+ '<button id="gpx-to-gj-line">Line</button>'
		+ '<p>'
			+ '<b>Points</b> converts to a GeoJSON collection with all the points'
			+ '<br/><br/>'
			+ '<b>Line</b> converts to a GeoJSON collection with one \"LineString\" feature'
			+ '<br/><br/>'
			+ 'If you want to show a ride/run on a map, \"Line\" is what you want.'
		+ '</p>'
	callback()
}

exports.process = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<p id="gpx-msg"></p>'
	callback() 
}
