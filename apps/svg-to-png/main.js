var drop = require('../../components/drop-zone-svg')
var convert = require('../../components/convert-svg-to-png')

window.onload = function() {
	init()
}

function init() {
	drop('converter', function(data) { 
		convert('converter', data, function() {
			init()
		})
	})
}
