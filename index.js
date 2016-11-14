var svgMap = require('./lib/create-svg-map')
var findLL = require('./lib/create-find-ll')
var draw = require('./lib/create-draw')
var converters = require('./lib/create-converters')
var selecters = require('./lib/create-selecters')
var args = process.argv

var cmd = args[2]
if(cmd === 'converters') {
	converters(function() { console.log('Done creating converters') })
} else if(cmd === 'selecters') {
	selecters(function() { console.log('Done creating selecters') })
} else if(cmd === 'svg-map') {
	svgMap(function() { console.log('Done creating svg-map') })
} else if(cmd === 'find-ll') {
	findLL(function() { console.log('Done creating find-latitude-longitude') })
} else if(cmd === 'draw') {
	draw(function() { console.log('Done creating draw') })
}



else {
	console.log(cmd + ' is not a valid argument')
}


