var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var save = require('../utils/save')
var process = require('./lib/process')
var Emitter = require('events').EventEmitter

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	var config = new Config(divId, evt, data)
	html.choose(config, function() {
		ctrl.choose(config)
	})

	evt.on('type-chosen', function() {
		html.bbox(config, function() {
			ctrl.bbox(config)
		})
	})

	evt.on('bbox-chosen', function() {
		html.processing(config, function() {
			process(config)
		})
	})

	evt.on('new-collection', function(col) {
		save.json(config.type + '-' + JSON.stringify(config.bbox) + '.json', col)
		callback()
	})
}

function Config(divId, evt, data) {
	var o = this
	o.divId = divId
	o.evt = evt
	o.type = null
	o.bbox = null
	o.feats = data.features
}
