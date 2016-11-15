var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var getBy = require('./lib/get-by')
var Emitter = require('events').EventEmitter
var geo = require('../utils/geo')
var save = require('../utils/save')


module.exports = function(divId, data, callback) {
	var config = { divId: divId, feats: data.features }
	var evt = new Emitter()
	config.props = geo.getAllProperties(config.feats)
	html.init(config, function() {
		ctrl.init(evt)
	})

	evt.on('property', function(prop) {
		config.prop = prop
		config.values = geo.getUniqPropertyValues(config.feats, prop)
		if(geo.numericValues(config.feats, prop)) {
			html.num(config, function() {
				ctrl.num(evt)
			})
		} else {
			html.notNum(config, function() {
				ctrl.notNum(evt)
			})
		}
	})

	evt.on('values', function(values) {
		config.values = values
		save.json('selected-by-property.json', getBy.values(config))
		callback()
	})

	evt.on('rule', function(resp) {
		config.rule = resp 
		save.json('selected-by-property.json', getBy.rule(config))
		callback()
	})

}
