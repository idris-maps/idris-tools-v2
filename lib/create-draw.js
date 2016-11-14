var html = require('./html-templates/draw')
var exec = require('child_process').exec
var fs = require('fs')

var data = require('../data/draw.json')
data.link = {
	back: '',
	css: 'style.css',
	leafletCss: '../js/leaflet/leaflet.css',
	leafletJs: '../js/leaflet/leaflet.js',
	leafletDrawCss: '../js/leaflet/leaflet-draw.css',
	leafletDrawJs: '../js/leaflet/leaflet-draw.js',
}

module.exports = function(callback) {
	createHTML(data, function() {
		createJS(data, function() {
			callback()
		})
	})
}


function createHTML(data, callback) {
	fs.writeFile('public/draw/index.html', html(data), function(err) {
		if(err) { console.log('svg-map HTML Error:', err) }
		console.log('Created HTML for ' + data.name)
		callback()
	})
}

function createJS(data, callback) {
	var cmd0 = 'browserify apps/draw/main.js -o apps/draw/public/script.js'
	var cmd1 = 'minify --output public/draw/script.min.js apps/draw/public/script.js'
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
