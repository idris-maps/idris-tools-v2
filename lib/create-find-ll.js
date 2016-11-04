var html = require('./html-templates/find-ll')
var exec = require('child_process').exec
var fs = require('fs')

var data = require('../data/find-ll.json')
data.link = {
	back: '',
	css: 'style.css',
	leafletCss: '../js/leaflet/leaflet.css',
	leafletJs: '../js/leaflet/leaflet.js',
}

module.exports = function(callback) {
	createHTML(data, function() {
		createJS(data, function() {
			callback()
		})
	})
}


function createHTML(data, callback) {
	fs.writeFile('public/find-latitude-longitude/index.html', html(data), function(err) {
		if(err) { console.log('svg-map HTML Error:', err) }
		console.log('Created HTML for ' + data.name)
		callback()
	})
}

function createJS(data, callback) {
	var cmd0 = 'browserify apps/find-latitude-longitude/main.js -o apps/find-latitude-longitude/public/script.js'
	var cmd1 = 'minify --output public/find-latitude-longitude/script.min.js apps/find-latitude-longitude/public/script.js'
	run(cmd0, function() {
		run(cmd1, function() {
			console.log('Created JS for ' + data.name) 
			callback()
		}) 
	}) 
}

function run(cmd, callback) {
	console.log('COMMAND: ', cmd)
	exec(cmd, function(error, stdout, stderr) {
	 if(error) { console.log('ERROR: ', error) }
		if(stdout) { console.log('STDOUT: ', stdout) }
		if(stderr) { console.log('STDERR: ', stderr) }
		callback()
	})
}
