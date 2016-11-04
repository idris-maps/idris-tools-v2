var wkt = require('wellknown')
var fixString = require('./lib/fix-string')
var save = require('../utils/save')

module.exports = function(collection, callback) {
	var props = getProps(collection.features)
	var table = createTable(props)
	var inserts = createInserts(collection.features, props)
	var string = table + inserts
	save.text('temp_from_geojson.sql', string)
	callback()
}

function createInserts(feats, props) {
	var colStr = columnString(props)
	var str = ''
	feats.forEach(function(f) {
		var valStr = valuesString(props, f)
		str = str + 'INSERT INTO temp_from_geojson (' + colStr + ') VALUES('
		 + valStr + ');\n'
	})
	return str
}

function valuesString(props, f) {
	var str = ''
	props.forEach(function(p) {
		if(p.type === 'varchar') { str = str + '\'' + f.properties[p.name] + '\', '}
		else { str = str + +f.properties[p.name] + ', ' }
	})
	str = str + '\'' + wkt.stringify(f.geometry) + '\''
	return str
}

function columnString(props) {
	var str = ''
	props.forEach(function(p) {
		str = str + fixString(p.name) + ', '
	})
	str = str + 'wkt'
	return str
}

function createTable(props) {
	var str = 'CREATE TABLE temp_from_geojson (\n'
	props.forEach(function(p) { str = str +  fixString(p.name) + ' ' + p.type + ',\n'})
	str = str + 'wkt text\n'
		+ ');\n'
	return str
}

function getProps(feats) {
	var f0 = feats[0]
	var props = []
	for(k in f0.properties) {
		if(isNaN(f0.properties[k])) {
			var type = 'varchar'
		} else {
			var type = 'numeric'
		}
		props.push({name: k, type: type})
	}
	return props
}


