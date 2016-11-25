var apps = require('../data/selecters.json')
var html = require('./html-templates/select')
var exec = require('child_process').exec
var fs = require('fs')
var link = {
	back: 'http://www.idris-maps.com',
	css: '../css/selecter.css',
	leafletJS: '../../js/leaflet/leaflet.js',
	leafletCSS: '../../js/leaflet/leaflet.css'
}

module.exports = function(callback) {
	htmlLoop(0, apps, function() {
		jsLoop(0, apps, function() {
			callback()
		})
	})
}

function htmlLoop(i, apps, callback) {
	if(i === apps.length) { callback() }
	else {
		apps[i].link = link
		fs.writeFile('public/select/' + apps[i].folder + '/index.html', html(apps[i]), function(err) {
			if(err) { console.log('htmlLoop Error:', err, 'app:', apps[i]) }
			console.log('Created HTML for ' + apps[i].name)
			htmlLoop(i+1, apps, callback)
		})
	}
}

function jsLoop(i, apps, callback) {
	if(i === apps.length) { callback() }
	else {
		var cmd0 = 'browserify apps/' + apps[i].folder + '/main.js -o apps/' + apps[i].folder + '/public/script.js'
		var cmd1 = 'minify --output public/select/' + apps[i].folder + '/script.min.js apps/' + apps[i].folder + '/public/script.js'
		run(cmd0, function() {
			run(cmd1, function() {
				console.log('Created JS for ' + apps[i].name)
				jsLoop(i+1, apps, callback) 
			}) 
		}) 
	}
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


