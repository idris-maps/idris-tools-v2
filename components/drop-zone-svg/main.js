var comp = require('./index')
window.onload = function() {
	comp('whatever', function(x) {
		console.log('component callback:', x)
	})
}
