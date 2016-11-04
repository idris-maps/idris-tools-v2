(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
var drop = require('../../components/drop-zone-gpx/index')
var convert = require('../../components/convert-gpx/index')

window.onload = function() {
	init()
}

function init() {
	drop('converter', function(data) { 
		convert('converter', data, function() {
			init()
		})
	})
}

},{"../../components/convert-gpx/index":3,"../../components/drop-zone-gpx/index":9}],3:[function(require,module,exports){
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var Emitter = require('events').EventEmitter

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	html.init(divId, function() {
		ctrl(divId, data, evt)
	})
	evt.on('gpx-converted', function() {
		callback()
	})
}

},{"./lib/ctrl":6,"./lib/html":7,"events":1}],4:[function(require,module,exports){
module.exports = function(data, callback) {
	var f = featureDefault()
	var c = []
	var ele = 0
	var climb = 0
	var start = null
	var end = null
	data.forEach(function(d,i) {
		if(i === 0 && d.time) { start = d.time }
		if(i === data.length-1 && d.time) { end = d.time }		
		if(i === 0 && d.ele) { ele = d.ele }
		if(i !== 0 && d.ele) {
			if(d.ele > ele) { climb = climb + Math.floor(d.ele - ele); ele = d.ele }
		}
		c.push([d.lon, d.lat])
	})
	if(climb !== 0) { f.properties.climb = climb }
	if(start && end) { f.properties.time = elapsed(start, end) }
	f.geometry = {
		type: 'LineString',
		coordinates: c
	}
	callback({type: 'FeatureCollection', features: [f]})
}

function featureDefault() {
	return {
			type: 'Feature',
			properties: {},
			geometry: {}
	}
}

function elapsed(start, end) {
/*
http://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html#fbid=Ygj1xcdnTCD
*/
 var date1_ms = start
 var date2_ms = end
 var difference_ms = date2_ms - date1_ms
 difference_ms = difference_ms/1000
 var seconds = Math.floor(difference_ms % 60)
 difference_ms = difference_ms/60
 var minutes = Math.floor(difference_ms % 60)
 difference_ms = difference_ms/60
 var hours = Math.floor(difference_ms % 24)
 var days = Math.floor(difference_ms/24)
 
	if(days !== 0) { var str = days + ' d '} else { var str = '' }
 return str + dec(hours) + 'h ' + dec(minutes) + 'm ' + dec(seconds) + 's'
}

function dec(n) {
	if(n<10) { return '0' + n }
	else { return n }
}


},{}],5:[function(require,module,exports){
module.exports = function(data, callback) {
	var feats = []
	data.forEach(function(d,i) {
		var f = featureDefault()
		if(d.ele) { f.properties.ele = d.ele }
		if(d.time) { f.properties.time = d.time }
		f.geometry = {
			type: 'Point',
			coordinates: [d.lon, d.lat]
		}
		feats.push(f)
	})
	callback({type: 'FeatureCollection', features: feats})
}

function featureDefault() {
	return {
			type: 'Feature',
			properties: {},
			geometry: {}
	}
}




},{}],6:[function(require,module,exports){
var html = require('./html')
var msg = require('./msg')
var toPoints = require('./convert-to-points')
var toLine= require('./convert-to-line')
var save = require('../../utils/save')

module.exports = function(divId, data, evt) {
	var points = document.getElementById('gpx-to-gj-points')
	var line = document.getElementById('gpx-to-gj-line')
	var lineSimpl = document.getElementById('gpx-to-gj-line-simpl')

	points.onclick = function() {
		html.process(divId, function() {
			msg.write('Converting...')
			toPoints(data, function(col) {
				msg.write('Saving...')
				save.json('gpx-points.json', col)
				evt.emit('gpx-converted')
			})
		})
	}
	line.onclick = function() {
		html.process(divId, function() {
			msg.write('Converting...')
			toLine(data, function(col) {
				msg.write('Saving...')
				save.json('gpx-line.json', col)
				evt.emit('gpx-converted')
			})
		})
	}
}



},{"../../utils/save":17,"./convert-to-line":4,"./convert-to-points":5,"./html":7,"./msg":8}],7:[function(require,module,exports){
exports.init = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<b>Save as...</b>'
		+ '<button id="gpx-to-gj-points">Points</button>'
		+ '<button id="gpx-to-gj-line">Line</button>'
		+ '<p>'
			+ '<b>Points</b> converts to a GeoJSON collection with all the points'
			+ '<br/><br/>'
			+ '<b>Line</b> converts to a GeoJSON collection with one \"LineString\" feature'
			+ '<br/><br/>'
			+ 'If you want to show a ride/run on a map, \"Line\" is what you want.'
		+ '</p>'
	callback()
}

exports.process = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<p id="gpx-msg"></p>'
	callback() 
}

},{}],8:[function(require,module,exports){
exports.write = function(s) {
	var msg = document.getElementById('gpx-msg')
	msg.innerHTML = s
}

exports.add = function(s) {
	var msg = document.getElementById('gpx-msg')
	var html = msg.innerHTML
	msg.innerHTML = html + '</br>' + s
}

},{}],9:[function(require,module,exports){
var html = require('./lib/html')
var init = require('./lib/init')
var browse = require('./lib/browse')
var Emitter = require('events').EventEmitter

module.exports = function(divId, callback) {
	var evt = new Emitter()
	html.init(divId, function() {
		init(evt)
		var browseBtn = document.getElementById('browse-btn')
		browseBtn.onclick = function() {
			html.browse(divId, function() {
				browse(evt)
			})
		}
	})
	evt.on('gpx-parsed', function(pts) { callback(pts) })
}

},{"./lib/browse":10,"./lib/html":11,"./lib/init":12,"events":1}],10:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function(evt) {
	var input = document.getElementById('file-input')
	input.onchange = function(e) {
		verify(input.files[0], evt)
	}
}

},{"./msg":13,"./verify-dropped":16}],11:[function(require,module,exports){
exports.init = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<div id="drop-zone"></div>'
		+ '<p id="msg"></p>'
		+ '<button id="browse-btn">Browse the file system</button>'
	callback()
}

exports.browse = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<p id="msg">Load a GPX file</p>'
		+ '<input id="file-input" type="file"></input>'
	callback()
}

},{}],12:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function(evt) {
	if(window.FileReader) {
		var dz = document.getElementById('drop-zone')
		rmDefault(dz)
		dz.ondrop = function(e) { whenDrop(e, evt) } 
		msg.write('Drop a GPX file')
		msg.add('or')
	} else {
		msg.write('Your browser does not support the HTML5 FileReader.')
	}
}

function whenDrop(e, evt) {
	e.preventDefault()
	verify(e.dataTransfer.files[0], evt)
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


},{"./msg":13,"./verify-dropped":16}],13:[function(require,module,exports){
exports.write = function(m) {
	var p = document.getElementById('msg')
	p.innerHTML = m
}

exports.add = function(m) {
	var p = document.getElementById('msg')
	var c = p.innerHTML
	p.innerHTML = c + '<br/>' + m
}

},{}],14:[function(require,module,exports){
var msg = require('./msg')

module.exports = function(xml, callback) {
	var gpx = xml.children[0]
	if(gpx.nodeName !== 'gpx') { callback('Not a valid GPX file') }
	else {
		parseGpx(gpx, function(points) {
			msg.write('Done parsing')
			callback(null, points)
		})
	}
}

function parseGpx(gpx, callback) {
	gpxLoop(0, gpx.children, [], function(pts) {
			callback(pts)
	})
}

function parseTrk(trk, callback) {
	trkLoop(0, trk.children, [], function(pts) { 
		callback(pts)
	})
}

function parseTrkseg(trkseg, callback) {
	trksegLoop(0, trkseg.children, [], function(trkpts) {
		callback(trkpts)
	})
}

function parseTrkpt(trkpt, callback) {

	var o = {}
	var attrs = trkpt.attributes
	for(i=0;i<attrs.length;i++) {
		if(attrs[i].name === 'lat') { o.lat = +attrs[i].value }
		if(attrs[i].name === 'lon') { o.lon = +attrs[i].value }
	}
	var childs = trkpt.children
	for(j=0;j<childs.length;j++) {
		if(childs[j].nodeName === 'ele') {
			o.ele = +childs[j].textContent
		}
		if(childs[j].nodeName === 'time') {
			var d = new Date(childs[j].textContent)
			o.time = Date.parse(d)
		}
	}
	if(o.lat && o.lon) {
		callback(o)
	} else {
		callback(null)
	}
}

function gpxLoop(i, children, trks, callback) {
	if(i === children.length) { callback(trks) }
	else {
		if(children[i].tagName === 'trk') {
			parseTrk(children[i], function(pts) {
				pts.forEach(function(pt) { trks.push(pt) })
				gpxLoop(i+1, children, trks, callback)
			})
		} else {
			gpxLoop(i+1, children, trks, callback)
		}
	}
}

function trkLoop(i, children, trksegs, callback) {
	if(i === children.length) { callback(trksegs) }
	else {
		if(children[i].tagName === 'trkseg') {
			parseTrkseg(children[i], function(trkpts) { 
				trkpts.forEach(function(pt) { trksegs.push(pt) })
				trkLoop(i+1, children, trksegs, callback)
			})
		} else {
			trkLoop(i+1, children, trksegs, callback)
		}
	}
}

function trksegLoop(i, children, trkpts, callback) {
	if(i === children.length) { callback(trkpts) }
	else {
		if(children[i].tagName === 'trkpt') {
			parseTrkpt(children[i], function(pt) { 
				if(pt) { trkpts.push(pt) }

				if(Math.floor(i/1000) === i/1000) {
					setTimeout(function() {
						msg.write('Parsed ' + i + ' of ' + children.length + ' points')
						trksegLoop(i+1, children, trkpts, callback)
					},1)
				} else {

					trksegLoop(i+1, children, trkpts, callback)
				}
			})
		} else {
			trksegLoop(i+1, children, trkpts, callback)
		}
	}
}


},{"./msg":13}],15:[function(require,module,exports){
module.exports = function(file, callback) {
	var reader = new FileReader()
	reader.onload = function() {
		parseXML(reader.result, function(err, xml) {
			callback(err, xml)
		})
	}
	reader.readAsText(file)
}

function parseXML(string, callback) {
	if(window.DOMParser) {
		var parser = new window.DOMParser()
		callback(null, parser.parseFromString(string, 'text/xml'))
 } else {
		callback('Your browser does not support \"DOMParser\"')
	}
}

},{}],16:[function(require,module,exports){
var msg = require('./msg')
var readGPX = require('./read-xml')
var parseGPX = require('./parse-gpx')

module.exports = function(file, evt) {
	msg.write('Verifying document...')
	if(isGPX(file)) {
		readGPX(file, function(err, xml) {
			if(err) { msg.write(err) }
			else { 
				parseGPX(xml, function(err, pts) {
					if(err) { msg.write(err) }
					else { evt.emit('gpx-parsed', pts) }
				})
			}
		})
	}
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

function isGPX(file) {
	if(file.type === 'application/gpx+xml' || file.type === 'application/gpx') {
		msg.write('Document is a GPX file')
		return true
	} else {
		msg.write('Document is not a GPX file')
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

},{"./msg":13,"./parse-gpx":14,"./read-xml":15}],17:[function(require,module,exports){
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


},{}]},{},[2]);
