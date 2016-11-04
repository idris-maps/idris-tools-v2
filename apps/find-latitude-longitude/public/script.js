(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var findLL = require('../../components/find-lat-lng')

window.onload = function() {
	document.getElementById('map').style.height = (window.innerHeight - 85) + 'px'
	findLL()
}

window.onresize = function() {
	console.log('resize')
	document.getElementById('map').style.height = (window.innerHeight - 85) + 'px'
}


},{"../../components/find-lat-lng":2}],2:[function(require,module,exports){
module.exports = function() {
	if(L) { run() }
	else { console.log('\"Find latitude - longitude\" needs leaflet') }
}

function run() {
	var map = L.map('map').setView([0,0],2)
	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	})
	tiles.addTo(map)

	var marker
	map.on('click', function(e) {
		if(typeof(marker)==='undefined') {
		 marker = new L.marker(e.latlng)
		 marker.addTo(map)   
		} else {
		 marker.setLatLng(e.latlng)        
		}
		var p = e.latlng
		var str = 'latitude: ' + s(p.lat) + '</br>'
			+ 'longitude: ' + s(p.lng) + '</br>'
			+ '[' + s(p.lng) + ',' + s(p.lat) + ']' 
		marker.bindPopup(str).openPopup()
	})
}

function s(n) {
	return Math.floor(n * 1000000) / 1000000
}

},{}]},{},[1]);
