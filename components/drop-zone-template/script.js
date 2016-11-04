(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function() {
	var input = document.getElementById('file-input')
	input.onchange = function(e) {
		verify(input.files[0])
	}
}

},{"./msg":4,"./verify-dropped":5}],2:[function(require,module,exports){
exports.init = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<div id="drop-zone"></div>'
		+ '<p id="msg"></p>'
		+ '<button id="browse-btn">Browse the file system</button>'
	callback()
}

exports.browse = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<p id="msg">Load a GeoJSON file</p>'
		+ '<input id="file-input" type="file"></input>'
	callback()
}

},{}],3:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function() {
	if(window.FileReader) {
		var dz = document.getElementById('drop-zone')
		rmDefault(dz)
		dz.ondrop = function(e) { whenDrop(e) } 
		msg.write('Drop a GeoJSON file')
		msg.add('or')
	} else {
		msg.write('Your browser does not support the HTML5 FileReader.')
	}
}

function whenDrop(e) {
	e.preventDefault()
	verify(e.dataTransfer.files[0])
}

function rmDefault(el) {
	el.ondragover = function(e) {
		e.preventDefault()
		return false
	}
	el.ondragenter = function(e) {
		e.preventDefault()
		return false
	}
}


},{"./msg":4,"./verify-dropped":5}],4:[function(require,module,exports){
exports.write = function(m) {
	var p = document.getElementById('msg')
	p.innerHTML = m
}

exports.add = function(m) {
	var p = document.getElementById('msg')
	var c = p.innerHTML
	p.innerHTML = c + '<br/>' + m
}

},{}],5:[function(require,module,exports){
var msg = require('./msg')

module.exports = function(file) {
	msg.write('Verifying document...')
	console.log(file)
	//verify
}

function getName(file) {
	var spl = file.name.split('.')
	var n = ''
	spl.forEach(function(s, i) {
		if(i < spl.length-1) {
			if(i === 0) { n = s }
			else { n = n + '-' + s }
		}
	})
	return n
}

function isJSON(file) {
	if(file.type === 'application/json') {
		msg.write('Document is a JSON file')
		msg.add('Verifying if it is a valid GeoJSON file...')
		return true
	} else {
		msg.write('Document is not a JSON file')
		return false
	}
}

function isTooBig(file) {
	var s = file.size
	console.log('size', s)
	if(s > 21000000) {
		msg.write('The document is bigger than 20Mb.')
		msg.add('Try to \"simplify\" it.')
		msg.add('There is an online tool (not related to \"Idris maps\") that lets you do that:')
		msg.add('<a href="http://mapshaper.org/">Mapshaper</a>')	
		return true
	} else {
		return false
	}
}

},{"./msg":4}],6:[function(require,module,exports){
var html = require('./lib/html')
var init = require('./lib/init')
var browse = require('./lib/browse')

window.onload = function() {
	html.init('whatever', function() {
		init()
		var browseBtn = document.getElementById('browse-btn')
		browseBtn.onclick = function() {
			html.browse('whatever', function() {
				browse()
			})
		}
	})
}

},{"./lib/browse":1,"./lib/html":2,"./lib/init":3}]},{},[6]);
