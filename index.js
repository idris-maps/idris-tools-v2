var svgMap = require('./lib/create-svg-map')
var findLL = require('./lib/create-find-ll')
var draw = require('./lib/create-draw')
var converters = require('./lib/create-converters')
var selecters = require('./lib/create-selecters')
var edit = require('./lib/create-edit')
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
} else if(cmd === 'edit') {
	edit(function() { console.log('Done creating edit-properties') })
} else if(cmd === 'all') {
	converters(function() { console.log('Done creating converters') 
	selecters(function() { console.log('Done creating selecters') 
	svgMap(function() { console.log('Done creating svg-map') 
	findLL(function() { console.log('Done creating find-latitude-longitude') 
	draw(function() { console.log('Done creating draw') 
	edit(function() { console.log('Done creating edit-properties') })
	})
	})
	})
	})
	})
}



else {
	console.log(cmd + ' is not a valid argument')
}


