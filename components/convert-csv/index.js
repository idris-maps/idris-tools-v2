var Conf = require('./lib/Conf')
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var parseCsv = require('./lib/parse')
var save = require('../utils/save')
var Emitter = require('events').EventEmitter

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	html.parsing(divId, function() {
		parseCsv(data, function(parsed) {
			if(parsed.errors.length > 0) {
				html.parseErrors(divId, parsed.errors)
			} else {
				var conf = new Conf(divId, parsed.data, evt)
				checkHead(conf)
				conf.evt.on('csv-converted', function() { callback() })
			}
		})
	})
}

function checkHead(conf) {
	html.header(conf.divId, conf.data, function() {
		ctrl.header(function(hasHead) {
			if(hasHead) {
				conf.hasHead()
				geoCol(conf)
			} else {
				html.setHead(conf.divId, conf.data, function() {
					ctrl.setHead(conf.nbCols, function(head) {
						conf.setHead(head)
						geoCol(conf)
					})
				})
			}
		})
	})
}

function geoCol(conf) {
	html.geoCol(conf.divId, function() {
		ctrl.geoCol(function(isWKT) {
			if(isWKT) {
				chooseWKT(conf)
			} else {
				chooseLL(conf)
			}
		})
	})
}

function chooseLL(conf) {
	html.llCol(conf.divId, conf.head, function() {
		ctrl.llCol(function(lng, lat) {
			conf.setLL(lng, lat, function() {
				conf.geojson(function(col) {
					save.json('collection.json', col)
					conf.evt.emit('csv-converted')
				})
			})
		})
	})
}

function chooseWKT(conf) {
	html.wktCol(conf.divId, conf.head, function() {
		ctrl.wktCol(function(wkt) {
			console.log(conf)
			conf.setWKT(wkt, function() {
				conf.geojson(function(col) {
					save.json('collection.json', col)
					conf.evt.emit('csv-converted')
				})	
			})
		})
	})
}






