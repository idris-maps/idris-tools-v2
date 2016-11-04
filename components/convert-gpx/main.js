var comp = require('./index')
var data = require('../../test-data/drop-zone-gpx.json')

window.onload = function() {
	comp('whatever', data)
}
