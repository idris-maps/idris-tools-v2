var comp = require('./index')

window.onload = function() {
	comp('whatever', function(buffer) {
		console.log(buffer)
	})
}
