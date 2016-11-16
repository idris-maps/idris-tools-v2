var drop = require('../../components/drop-zone-geojson-simple')
var select = require('../../components/select-by-click')

window.onload = function() {
	init()
}

window.onresize = function() {
	setMapSize()
}

function init() {
	drop('selecter', function(data) {
		reset('selecter', 'map', function() {
			select('map', data, function() {
				reset('map', 'selecter', function() {
					init()
				})
			})
		})
	})
}

function reset(oldId, newId, callback) {
	var old = document.getElementById(oldId)
	old.parentNode.removeChild(old)
	var n = document.createElement('div')
	n.id = newId
	document.body.appendChild(n)
	if(newId === 'map') { 
		setMapSize() 
		var t = document.getElementById('title')
		t.parentNode.removeChild(t)
	}
	callback()
}


function setMapSize() {
	var mapH = window.innerHeight - document.getElementById('header').offsetHeight
	document.getElementById('map').style.height = mapH + 'px'
}
