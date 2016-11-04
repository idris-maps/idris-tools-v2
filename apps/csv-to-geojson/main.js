var drop = require('../../components/drop-zone-csv/index')
var convert = require('../../components/convert-csv/index')

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
