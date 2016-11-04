var data = require('./data/cantons_1%.json')
var Map = require('./index')
var getBbox = require('../utils/geo').getBbox

var bbox = getBbox(data)
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

//console.log(map.getLayersData())
console.log(map.getLayerProperties(0))
console.log(map.getLayerPropertyValues(0, 'name'))
/*
setTimeout(function() {
	map.layers[0].changeLayerStyle({fill: 'blue'})
	map.layers[0].addStyleByFeature({type: 'fill', property: 'abbrev', data: [{propValue: 'GE', styleValue: 'red'}]})
	map.layers[0].removeStyleByFeature(1)

var svg = map.outerHTML()
var fs = require('fs')
fs.writeFileSync('test.svg', svg, 'utf-8')

	console.log(map.layers[0].getData())
},2000)
*/


