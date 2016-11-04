var data = require('./data/cantons_1%.json')
var data2 = require('./data/peaks.json')
var Map = require('./index')
var getBbox = require('./lib/bbox')

var bbox = getBbox.fromCollection(data)
var map = new Map(bbox, {width: 1000, height: 500})

map.addLayer({
	type: 'polygon',
	name: 'cantons',
	data: data,
	style: {
		layer: {fill: 'red'},
		byFeature: [
			{type: 'fill', property: 'abbrev', data: [{propValue: 'VD', styleValue: 'green'}]},
			{type: 'stroke-width', property: 'name', data: [{propValue: 'Jura', styleValue: 5}]}
		]
	}
})

map.addLayer({
	type: 'point',
	name: 'peaks',
	data: data2,
	style: {
		layer: { fill: 'green' },
		byFeature: [
			{type: 'fill', property: 'rank', data: [{propValue: 1, styleValue: 'blue'}]},
			{type: 'r', property: 'rank', data: [{propValue: 2, styleValue: 25}]}
		]
	}
})

map.addLayer({
	type: 'label',
	name: 'peaks',
	data: data2,
	property: 'name',
	style: {
		layer: { 'font-size': 5, 'font-family': 'serif'},
		byFeature: [
			{type: 'fill', property: 'rank', data: [{propValue: 1, styleValue: 'blue'}]}
		]
	}
})


var svg = map.outerHTML()
var fs = require('fs')
fs.writeFileSync('test-all.svg', svg, 'utf-8')
