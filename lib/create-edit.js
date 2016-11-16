var app = require('../data/edit.json')
var html = require('./html-templates/edit')
var exec = require('child_process').exec
var fs = require('fs')
var link = {
	back: '',
	css: 'style.css'
}

module.exports = function(callback) {
	app.link = link
	writeHtml(app, function() {
		writeJs(app, function() {
			callback()
		})
	})
}

function writeHtml(app, callback) {
		fs.writeFile('public/edit-properties/index.html', html(app), function(err) {
			if(err) { console.log('htmlLoop Error:', err, 'app:', app) }
			console.log('Created HTML for ' + app.name)
			callback()
		})
}

function writeJs(app, callback) {
		var cmd0 = 'browserify apps/edit-properties/main.js -o apps/edit-properties/public/script.js'
		var cmd1 = 'minify --output public/edit-properties/script.min.js apps/edit-properties/public/script.js'
		run(cmd0, function() {
			run(cmd1, function() {
				console.log('Created JS for ' + app.name)
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
