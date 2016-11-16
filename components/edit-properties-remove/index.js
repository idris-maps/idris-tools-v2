var geo = require('../utils/geo')
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var save = require('../utils/save')
var Emitter = require('events').EventEmitter
var process = require('./lib/process')

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	var props = geo.getAllProperties(data.features)

	html.init(divId, props, function() {
		ctrl.init(evt)
	})

	var newCol
	evt.on('props-to-keep', function(props) {
		process(data.features, props, function(feats) { 
			newCol = {type: 'FeatureCollection', features: feats}
			html.done(divId, function() {
				ctrl.done(evt)
			})
		})
	})

	evt.on('save', function() {
		save.json('edited.json', newCol)
		callback(null)
	})

	evt.on('continue', function() {
		callback(newCol)
	})
}
