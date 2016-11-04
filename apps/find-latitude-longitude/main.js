var findLL = require('../../components/find-lat-lng')

window.onload = function() {
	document.getElementById('map').style.height = (window.innerHeight - 85) + 'px'
	findLL()
}

window.onresize = function() {
	console.log('resize')
	document.getElementById('map').style.height = (window.innerHeight - 85) + 'px'
}

