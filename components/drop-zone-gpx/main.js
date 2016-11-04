var comp = require('./index')

window.onload = function() {
	comp('whatever', function(pts) {
		console.log(pts)
	})
}
