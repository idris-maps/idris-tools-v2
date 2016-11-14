var draw = require('../../components/draw')

window.onload = function() {
	setMapHeight()
	draw('map')
}

window.onresize = function() {
	setMapHeight()
}

function setMapHeight() {
	var mapH = window.innerHeight - document.getElementById('header').offsetHeight
	document.getElementById('map').style.height = mapH + 'px'	
}

