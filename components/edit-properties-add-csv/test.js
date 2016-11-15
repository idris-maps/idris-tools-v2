var comp = require('./index')
var data = require('./data.json')

comp('test', data, function(r) {
	console.log(r)
})
