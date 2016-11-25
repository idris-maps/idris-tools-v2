(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var draw = require('../../components/draw')

window.onload = function() {
	setMapHeight()
	draw('map')
}

window.onresize = function() {
	setMapHeight()
}

function setMapHeight() {
	var mapH = window.innerHeight - document.getElementById('header').offsetHeight
	document.getElementById('map').style.height = mapH + 'px'	
}


},{"../../components/draw":2}],2:[function(require,module,exports){
var init = require('./lib/init')

module.exports = function(divId) {
	var map = init(divId)
}


},{"./lib/init":5}],3:[function(require,module,exports){
module.exports = function() {
	var o = this
	o.id = 0
	o.propKeys = []
	o.properties = {}
	o.addGeom = function(obj) {
		o.id = o.id + 1
		o.properties[obj.layer._leaflet_id] = { id: o.id, layerType: obj.layerType }
	}

	o.addProperty = function(leafletId, key, value) {
		if(!isNaN(value)) { value = +value }
		o.properties[leafletId][key] = value
		var exist = false
		o.propKeys.forEach(function(pk) {
			if(pk === key) { exist = true }
		})
		if(!exist) { o.propKeys.push(key) }
	}
	o.getProperties = function(leafletId) {
		var props = []
		for(k in o.properties[leafletId]) {
			props.push({ key: k, value: o.properties[leafletId][k] })
		}
		return props
	}
	o.toGeoJSON = function(drawn) {
		var features = []
		for(k in drawn._layers) {
			var f = {
				type: 'Feature',
				properties: o.properties[k],
				geometry: toGeom(o.properties[k].layerType, drawn._layers[k])
			}
			features.push(f)
		}
		return {type: 'FeatureCollection', features: features}
	} 
}

function toGeom(type, layer) {
	if(type === 'rectangle') { 
		var t = 'Polygon'
		var cc = []
		layer._latlngs[0].forEach(function(p) { cc.push([p.lng, p.lat]) })
		cc.push([layer._latlngs[0][0].lng, layer._latlngs[0][0].lat])
		var c = [cc]
	} else if(type === 'polygon') {  
		var t = 'Polygon'
		var cc = []
		layer._latlngs[0].forEach(function(p) { cc.push([p.lng, p.lat]) })
		cc.push([layer._latlngs[0][0].lng, layer._latlngs[0][0].lat])
		var c = [cc]
	} else if(type === 'polyline') {
		var t = 'LineString'
		var c = []
		layer._latlngs.forEach(function(p) { c.push([p.lng, p.lat]) })
	} else if(type === 'marker') { 
		var t = 'Point'
		var c = [layer._latlng.lng, layer._latlng.lat] 
	}
	return {
		type: t,
		coordinates: c
	}
}

},{}],4:[function(require,module,exports){
var icon = 'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAYAAAC9pNwMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADtQAAA7UBCn5qWwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEnSURBVEiJ7ZUxSgNREEDfhBQBMQhWKVKJIKRQS9N5ghRewNoj2FjlACGQG6QWC/EGokjQwkLSh1ib3rFwId/N7s7ssrhFdmCK/Tv/vQ+fmY+q4kngBFAjL728BhVFLa7Ftbi0kGg4bP4QOQDGrA+3C/QN3juwCL5HqvqQWGlMqxvsaZWW90AjlW2IBbgrIJ0De5lsx4xuAx85pCugZ3KdD8QR8OUUX7iYOV6nAfBtSIdunrcwkl9nSG+JuqR0cSSfJkhfgZ1cnALiFvAcSD+Bbl6OAG+x1r5S1ceNhg9CRDrAC7APnKvqk1HfBybhWhM4jtW1syAAqroUkQFwaEkD5h9P07EpTT4DZkX3b9/rVJk46Y7PRKRVsuc0viD89uK/x/bdcWXiH2BFcZ2Yon4xAAAAAElFTkSuQmCC'

var save = require('../../utils/save')

module.exports = function(obj) {
	var btn = L.Control.extend({
		options: {
		  position: 'topright'
		},
		onAdd: function(map) {
		  var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
		  container.style.backgroundColor = 'white'    
		  container.style.width = '30px'
		  container.style.height = '30px'
			container.style.padding = '5px'
			container.innerHTML = '<img id="download-btn" src="data:image/png;base64,' + icon + '" style="width:100%"/>'
		  container.onclick = function(){
		    save.json('geo.json', obj.toGeoJSON())
		  }
		  return container;
		}
	})
	var o = this
	o.shown = false
	o.map = obj.map
	o.show = function() {
		if(!o.shown) {
			o.map.addControl(new btn())
			o.shown = true
		}
	}
}

},{"../../utils/save":7}],5:[function(require,module,exports){
var Data = require('./Data')
var evt = require('./on-event')
var dlBtn =  require('./download-button')
var tiles = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

module.exports = function(divId) {
	var o = this
	o.data = new Data()
	o.map = L.map(divId).setView([25,0],2)
	o.dlBtn = new dlBtn(o)

	tiles.addTo(map)

	o.drawn = new L.FeatureGroup()
	map.addLayer(drawn)


	var drawControl = new L.Control.Draw({ edit: { featureGroup: drawn }})
	map.addControl(drawControl)

	removeCircle()

	o.map.on('draw:created', function(e) {
		evt.onDrawCreated(e, o)
	})

	o.drawn.on('click', function(e) {
		evt.onDrawnClick(e, o)
	})

	o.toGeoJSON = function() {
		return o.data.toGeoJSON(o.drawn)
	}





	return o
}

function removeCircle() {
	var circle = document.getElementsByClassName('leaflet-draw-draw-circle')[0]
	circle.parentNode.removeChild(circle)
}



},{"./Data":3,"./download-button":4,"./on-event":6}],6:[function(require,module,exports){
exports.onDrawCreated = function(e, o) {
	var layer = e.layer
	o.drawn.addLayer(layer)
	o.data.addGeom(e)
	o.dlBtn.show()
	if(o.data.propKeys.length !== 0) {
		var html = '<b>Add properties</b>'
		o.data.propKeys.forEach(function(p) {
			html = html + '<br/><input class="props-input" id="' + p + '" placeholder="key: ' + p + '">'
		})
		html = html + '<br/><button id="add-props">OK</button>'
		layer.bindPopup(html).openPopup()
		document.getElementById('add-props').onclick = function() {
			var inputs = document.getElementsByClassName('props-input')
			for(i=0;i<inputs.length;i++) {
				o.data.addProperty(layer._leaflet_id, inputs[i].id, inputs[i].value)
			}
			layer.closePopup()
		}
	}
}

exports.onDrawnClick = function(e, o) {
	var props = o.data.getProperties(e.layer._leaflet_id)
	var html = '<b>Properties</b>'
	props.forEach(function(p) {
		html = html + '<br/><b>' + p.key + '</b>: ' + p.value
	})
	html = html + '<br/><button id="add-property">Add property</button>'
	e.layer.bindPopup(html).openPopup()
	document.getElementById('add-property').onclick = function() {
		var form = '<b>Add property</b>'
				+ '<input id="key" placeholder="key">'
				+ '<input id="value" placeholder="value">'
				+ '<br/><button id="add-property-form">OK</button>'
		e.layer.bindPopup(form)
		document.getElementById('add-property-form').onclick = function() {
			if(document.getElementById('key').value && document.getElementById('value').value) {
				o.data.addProperty(e.layer._leaflet_id, document.getElementById('key').value, document.getElementById('value').value)
			}
			e.layer.closePopup()
		}
	}
} 

},{}],7:[function(require,module,exports){
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}

exports.json = function(fileName, data) {
	var blob = new Blob([JSON.stringify(data)], {type: 'application/json;charset=utf-8'})
	saveAs(blob, fileName)
}

exports.text = function(fileName, string) {
	var blob = new Blob([string], {type: 'text/plain;charset=utf-8'})
	saveAs(blob, fileName)
}

exports.svg = function(fileName, string) {
	var blob = new Blob([string], {type: 'image/svg+xml;charset=utf-8'})
	saveAs(blob, fileName)
}

exports.blob = function(fileName, blob) {
	saveAs(blob, fileName)
}


},{}]},{},[1]);
