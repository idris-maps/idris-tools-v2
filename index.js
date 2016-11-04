var svgMap = require('./lib/create-svg-map')
var findLL = require('./lib/create-find-ll')
var converters = require('./lib/create-converters')
var args = process.argv

var cmd = args[2]
if(cmd === 'converters') {
	converters(function() { console.log('Done creating converters') })
} else if(cmd === 'svg-map') {
	svgMap(function() { console.log('Done creating svg-map') })
} else if(cmd === 'find-ll') {
	findLL(function() { console.log('Done creating find-latitude-longitude') })
}


else {
	console.log(cmd + ' is not a valid argument')
}


