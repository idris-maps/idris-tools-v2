exports.write = function(s) {
	var msg = document.getElementById('gpx-msg')
	msg.innerHTML = s
}

exports.add = function(s) {
	var msg = document.getElementById('gpx-msg')
	var html = msg.innerHTML
	msg.innerHTML = html + '</br>' + s
}
