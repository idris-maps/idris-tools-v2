var data = require('./data/peaks.json')
var Map = require('./index')
var getBbox = require('./lib/bbox')

var bbox = getBbox.fromCollection(data)
var map = new Map(bbox, {width: 1000, height: 500})

map.addLayer({
	type: 'point',
	name: 'peaks',
	data: data,
	style: {
		layer: { fill: 'green' },
		byFeature: [
			{type: 'fill', property: 'rank', data: [{propValue: 1, styleValue: 'blue'}]},
			{type: 'r', property: 'rank', data: [{propValue: 2, styleValue: 25}]}
		]
	}
})

var svg = map.outerHTML()
var fs = require('fs')
fs.writeFileSync('test-points.svg', svg, 'utf-8')
