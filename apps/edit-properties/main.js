var drop = require('../../components/drop-zone-geojson-simple')
var main = require('../../components/edit-main')
var rm = require('../../components/edit-properties-remove')
var addCsv = require('../../components/edit-properties-add-csv')
var Emitter = require('events').EventEmitter

window.onload = function() {
	var conf = {}
	conf.evt = new Emitter()
	drop('edit', function(data) {
		conf.data = data
		menu(conf)
	})
}

function menu(conf) {
console.log('main', conf)
	main('edit', conf, function(type) {
		if(type === 'rm') { rm('edit', conf.data, function(r) { back(conf, r) }) }
		else if(type === 'add-csv') {	addCsv('edit', conf.data, function(r) { back(conf, r) }) }
	})
}

function back(conf, r) {
	if(r) { conf.data = r }
	conf.modif = true
	menu(conf)
}
