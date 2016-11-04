var comp = require('./index')

window.onload = function() {
	comp('whatever', function(data) {
		console.log(data)
	})
}
