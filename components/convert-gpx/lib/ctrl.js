var html = require('./html')
var msg = require('./msg')
var toPoints = require('./convert-to-points')
var toLine= require('./convert-to-line')
var save = require('../../utils/save')

module.exports = function(divId, data, evt) {
	var points = document.getElementById('gpx-to-gj-points')
	var line = document.getElementById('gpx-to-gj-line')
	var lineSimpl = document.getElementById('gpx-to-gj-line-simpl')

	points.onclick = function() {
		html.process(divId, function() {
			msg.write('Converting...')
			toPoints(data, function(col) {
				msg.write('Saving...')
				save.json('gpx-points.json', col)
				evt.emit('gpx-converted')
			})
		})
	}
	line.onclick = function() {
		html.process(divId, function() {
			msg.write('Converting...')
			toLine(data, function(col) {
				msg.write('Saving...')
				save.json('gpx-line.json', col)
				evt.emit('gpx-converted')
			})
		})
	}
}


