var geo = require('../utils/geo')
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var parseCsv = require('./lib/parse')
var Emitter = require('events').EventEmitter
var drop = require('../drop-zone-csv')
var utils = require('./lib/utils')

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	var conf = {}
	conf.feats = data.features
	conf.geoProps = geo.getAllProperties(data.features)

	drop(divId, function(csvData) {
		html.parsing(divId, function() {
			parseCsv(csvData, function(result) {
				utils.checkParsed(evt, result)
			})
		})
	})	

	evt.on('parse-errors', function(errs) {
		html.parseErrors(divId, errs)
	})

	evt.on('parse-success', function(csv) {
		conf.csv = csv
		html.header(divId, csv[0], function() {
			ctrl.header(evt)
		})
	})

	evt.on('is-not-head', function() {
		html.setHead(divId, conf.csv[0], function() {
			ctrl.setHead(evt, conf.csv[0].length)
		})
	})

	evt.on('is-head', function() {
		evt.emit('got-header', csv[0], true)
	})

	evt.on('got-header', function(head, removeFirst) {
		conf.head = head
		if(removeFirst) { conf.csv.splice(0,1) }
		conf.csvJson = utils.csvToJson(conf.head, conf.csv)
		html.joinProps(divId, conf.geoProps, conf.head, function() {
			ctrl.joinProps(evt)
		})
	})

	evt.on('join-props', function(geoProp, csvProp) {
		conf.joinProps = { geo: geoProp, csv: csvProp }
		html.joining(divId, function() {
			utils.joinThem(evt, conf.feats, conf.csvJson, conf.joinProps)
		})
	})

	evt.on('joined', function(col) {
		conf.joined = col
		html.done(divId, function() {
			ctrl.done(evt)
		})
	})

	evt.on('save', function() {
		save.json('edited.json', conf.joined)
		callback(null)
	})

	evt.on('continue', function() {
		callback(conf.joined)
	})
}


