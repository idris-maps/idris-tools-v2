var data = require('./data/peaks.json')
var Map = require('./index')
var getBbox = require('./lib/bbox')

var bbox = getBbox.fromCollection(data)
var map = new Map(bbox, {width: 1000, height: 500})

map.addLayer({
	type: 'label',
	name: 'peaks',
	data: data,
	property: 'name',
	style: {layer: { 'font-size': 5, 'font-family': 'serif'}}
})

var svg = map.outerHTML()
var fs = require('fs')
fs.writeFileSync('test-label.svg', svg, 'utf-8')
