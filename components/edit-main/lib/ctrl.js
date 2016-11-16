exports.init = function(callback) {
	document.getElementById('add-csv').onclick = function() {
		callback('add-csv')
	}
	document.getElementById('rm').onclick = function() {
		callback('rm')
	}
}
