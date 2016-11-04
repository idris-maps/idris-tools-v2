var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function(evt) {
	var input = document.getElementById('file-input')
	input.onchange = function(e) {
		verify(input.files[0], evt)
	}
}
