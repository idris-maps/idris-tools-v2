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
var drop = require('../../components/drop-zone-geojson-simple')
var main = require('../../components/edit-main')
var rm = require('../../components/edit-properties-remove')
var addCsv = require('../../components/edit-properties-add-csv')
var Emitter = require('events').EventEmitter

window.onload = function() {
	var conf = {}
	conf.evt = new Emitter()
	drop('edit', function(data) {
		conf.data = data
		menu(conf)
	})
}

function menu(conf) {
	main('edit', conf, function(type) {
		if(type === 'rm') { rm('edit', conf.data, function(r) { back(conf, r) }) }
		else if(type === 'add-csv') {	addCsv('edit', conf.data, function(r) { back(conf, r) }) }
	})
}

function back(conf, r) {
	if(r) { conf.data = r }
	conf.modif = true
	menu(conf)
}

},{"../../components/drop-zone-geojson-simple":10,"../../components/edit-main":19,"../../components/edit-properties-add-csv":22,"../../components/edit-properties-remove":27,"events":1}],3:[function(require,module,exports){
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
	evt.on('read-csv', function(data) { callback(data) })
}

},{"./lib/browse":4,"./lib/html":5,"./lib/init":6,"events":1}],4:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function(evt) {
	var input = document.getElementById('file-input')
	input.onchange = function(e) {
		verify(input.files[0], evt)
	}
}

},{"./msg":7,"./verify-dropped":9}],5:[function(require,module,exports){
exports.init = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<div id="drop-zone"></div>'
		+ '<p id="msg"></p>'
		+ '<button id="browse-btn">Browse the file system</button>'
	callback()
}

exports.browse = function(id, callback) {
	var el = document.getElementById(id)
	el.innerHTML = '<p id="msg">Load a CSV or TSV file</p>'
		+ '<input id="file-input" type="file"></input>'
	callback()
}

},{}],6:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function(evt) {
	if(window.FileReader) {
		var dz = document.getElementById('drop-zone')
		rmDefault(dz)
		dz.ondrop = function(e) { whenDrop(e, evt) } 
		msg.write('Drop a CSV file')
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


},{"./msg":7,"./verify-dropped":9}],7:[function(require,module,exports){
exports.write = function(m) {
	var p = document.getElementById('msg')
	p.innerHTML = m
}

exports.add = function(m) {
	var p = document.getElementById('msg')
	var c = p.innerHTML
	p.innerHTML = c + '<br/>' + m
}

},{}],8:[function(require,module,exports){
module.exports = function(file, callback) {
	var reader = new FileReader()
	reader.onload = function() {
		callback(reader.result)
	}
	reader.readAsText(file)
}

},{}],9:[function(require,module,exports){
var msg = require('./msg')
var read = require('./read-text')

module.exports = function(file, evt) {
	msg.write('Verifying document...')
	if(isCSV(file)) {
		read(file, function(data) {
			evt.emit('read-csv', data)
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

function isCSV(file) {
	if(file.type === 'text/csv') {
		msg.write('Document is a CSV file')
		return true
	} else	if(file.type === 'text/tab-separated-values') {
		msg.write('Document is a TSV file')
		return true
	} else {
		msg.write('Document is not a CSV or TSV file')
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

},{"./msg":7,"./read-text":8}],10:[function(require,module,exports){
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
	evt.on('geojson-parsed', function(data) { callback(data) })
}

},{"./lib/browse":11,"./lib/html":12,"./lib/init":13,"events":1}],11:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./msg":14,"./verify-dropped":17,"dup":4}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
var msg = require('./msg')
var verify = require('./verify-dropped')

module.exports = function(evt) {
	if(window.FileReader) {
		var dz = document.getElementById('drop-zone')
		rmDefault(dz)
		dz.ondrop = function(e) { whenDrop(e, evt) } 
		msg.write('Drop a GeoJSON file')
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


},{"./msg":14,"./verify-dropped":17}],14:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],15:[function(require,module,exports){
module.exports = function(file, callback) {
	var reader = new FileReader()
	reader.onload = function() {
		callback(JSON.parse(reader.result))
	}
	reader.readAsText(file)
}

},{}],16:[function(require,module,exports){
var GJV = require("geojson-validation")

module.exports = function(json, callback) {
	if(json.type !== 'FeatureCollection') {
		callback(false, ['The file is not a GeoJSON FeatureCollection'])
	} else {
		GJV.valid(json, function(isValid, errors) {
			callback(isValid, errors)
		})
	}
} 

},{"geojson-validation":18}],17:[function(require,module,exports){
var msg = require('./msg')
var json = require('./read-json')
var geojson = require('./validate-geojson')

module.exports = function(file, evt) {
	msg.write('Verifying document...')
	if(isJSON(file)) {
		json(file, function(data) {
			isGeoJSON(data, function(isValid) {
				if(isValid) {
					var name = getName(file)
					evt.emit('geojson-parsed', data)
				}
			})
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

function isGeoJSON(data, callback) {
	geojson(data, function(isValid, errors) {
		if(isValid) { 
			msg.write('Document is a valid GeoJSON')
			callback(true)
		} else {
			msg.add('Document is not a valid GeoJSON')
			msg.add('Errors: ')
			errors.forEach(function(err) { 
				if(typeof err !== 'String') { err = err.toString() }
				msg.add(err) 
			})
			callback(false)
		}
	})
}

function isJSON(file) {
	var fileSplit = file.name.split('.')
	var fileType = fileSplit[fileSplit.length -1]
	if(fileType === 'json' || fileType === 'geojson') {
		msg.write('Document is a JSON file')
		msg.add('Verifying if it is a valid GeoJSON file...')
		return true
	} else {
		msg.write('Document is not a JSON file')
		return false
	}

/* ANDROID ????
	if(file.type === 'application/json') {
		msg.write('Document is a JSON file')
		msg.add('Verifying if it is a valid GeoJSON file...')
		return true
	} else {
		msg.write('Document is not a JSON file')
		return false
	}
*/
}

function isTooBig(file) {
	var s = file.size
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

},{"./msg":14,"./read-json":15,"./validate-geojson":16}],18:[function(require,module,exports){
/**
* geoJSON validation according to the GeoJSON spefication Version 1
* @module geoJSONValidation
* @class Main
* @exports {GJV} 
*/

(function(exports){

    var definitions = {};

    /**
     * Test an object to see if it is a function
     * @method isFunction 
     * @param object {Object}
     * @return {Boolean}
     */
    function isFunction(object) {
        return typeof(object) == 'function';
    }
    
    /**
     * A truthy test for objects
     * @method isObject
     * @param {Object}
     * @return {Boolean}
     */
    function isObject(object) {
        return object === Object(object);
    }

    /**
     * Formats error messages, calls the callback
     * @method done
     * @private
     * @param cb {Function} callback
     * @param [message] {Function} callback
     * @return {Boolean} is the object valid or not?
     */
    function _done(cb, message){
        var valid = false;

        if(typeof message === "string"){
            message = [message];

        }else if( Object.prototype.toString.call( message ) === '[object Array]' ) {
            if(message.length === 0){
                valid = true;
            }
        }else{
            valid = true;
        }

        if( isFunction(cb)){
            if(valid){
                cb(valid, []);
            }else{
                cb(valid, message);
            }
        }

        return valid;
    }

    /**
     * calls a custom definition if one is avalible for the given type
     * @method _customDefinitions 
     * @private
     * @param type {"String"} a GeoJSON object type
     * @param object {Object} the Object being tested 
     * @return {Array} an array of errors
     */
    function _customDefinitions(type, object){

        var errors;

        if(isFunction(definitions[type])){
            try{
                errors = definitions[type](object);
            }catch(e){
                errors = ["Problem with custom definition for '" + type + ": " + e];
            }
            if(typeof result === "string"){
                errors = [errors];
            }
            if(Object.prototype.toString.call( errors ) === '[object Array]'){
                return errors;
            }
        }
        return [];
    }

    /**
     * Define a custom validation function for one of GeoJSON objects
     * @method define 
     * @param type {GeoJSON Type} the type 
     * @param definition {Function} A validation function
     * @return {Boolean} Return true if the function was loaded corectly else false
     */
    exports.define = function(type, definition){
        if((type in all_types) && isFunction(definition)){
            //TODO: check to see if the type is valid
            definitions[type] = definition;
            return true;
        }
        return false;
    };

    /**
     * Determines if an object is a position or not
     * @method isPosition 
     * @param position {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isPosition = function(position, cb){

        var errors = [];

        //It must be an array
        if(Array.isArray(position)){
            //and the array must have more than one element
            if(position.length <= 1){
                errors.push("Position must be at least two elements");
            }
        }else{
            errors.push("Position must be an array");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("Position", position));

        return _done(cb, errors);
    };

    /**
     * Determines if an object is a GeoJSON Object or not
     * @method isGeoJSONObject|valid
     * @param geoJSONObject {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isGeoJSONObject = exports.valid = function(geoJSONObject, cb){

        if(!isObject(geoJSONObject)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];
        if('type' in geoJSONObject){
            if(non_geo_types[geoJSONObject.type]){
                return non_geo_types[geoJSONObject.type](geoJSONObject, cb);
            }else if(geo_types[geoJSONObject.type]){
                return geo_types[geoJSONObject.type](geoJSONObject, cb);
            }else{
                errors.push('type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"');
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("GeoJSONObject", geoJSONObject));
        return _done(cb, errors);
    };

    /**
     * Determines if an object is a Geometry Object or not
     * @method isGeometryObject
     * @param geometryObject {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isGeometryObject = function(geometryObject, cb){

        if(!isObject(geometryObject)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('type' in geometryObject){
            if(geo_types[geometryObject.type]){
                return geo_types[geometryObject.type](geometryObject, cb);
            }else{
                errors.push('type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon" or "GeometryCollection"');
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("GeometryObject", geometryObject));
        return _done(cb, errors);
    };

    /**
     * Determines if an object is a Point or not
     * @method isPoint
     * @param point {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isPoint = function(point, cb) {

        if(!isObject(point)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in point){
            exports.isBbox(point.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in point){
            if(point.type !== "Point"){
                errors.push("type must be 'Point'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in point){
            exports.isPosition(point.coordinates, function(valid, err){
                if(!valid){
                    errors.push('Coordinates must be a single position');
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("Point", point));

        return _done(cb, errors);
    };

    /**
     * Determines if an array can be interperted as coordinates for a MultiPoint
     * @method isMultiPointCoor
     * @param coordinates {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isMultiPointCoor = function(coordinates, cb) {

        var errors = [];

        if(Array.isArray(coordinates)){
            coordinates.forEach(function(val, index){
                exports.isPosition(val, function(valid, err){
                    if(!valid){
                        //modify the err msg from "isPosition" to note the element number
                        err[0] = "at "+ index+ ": ".concat(err[0]);
                        //build a list of invalide positions
                        errors = errors.concat(err);
                    }
                });
            });
        }else{
            errors.push("coordinates must be an array");
        }

        return _done(cb, errors);
    };
    /**
     * Determines if an object is a MultiPoint or not
     * @method isMultiPoint
     * @param position {Object}
     * @param cb {Function} the callback
     * @return {Boolean}
     */
    exports.isMultiPoint = function(multiPoint, cb) {

        if(!isObject(multiPoint)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in multiPoint){
            exports.isBbox(multiPoint.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in multiPoint){
            if(multiPoint.type !== "MultiPoint"){
                errors.push("type must be 'MultiPoint'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in multiPoint){
            exports.isMultiPointCoor(multiPoint.coordinates, function(valid, err){
                if(!valid){
                    errors =  errors.concat(err);
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("MultiPoint", multiPoint));

        return _done(cb, errors);
    };

    /**
     * Determines if an array can be interperted as coordinates for a lineString
     * @method isLineStringCoor
     * @param coordinates {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isLineStringCoor = function(coordinates, cb) {

        var errors = [];
        if(Array.isArray(coordinates)){
            if(coordinates.length > 1){
                coordinates.forEach(function(val, index){
                    exports.isPosition(val, function(valid, err){
                        if(!valid){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("coordinates must have at least two elements");
            }
        }else{
            errors.push( "coordinates must be an array");
        }

        return _done(cb, errors);
    };

    /**
     * Determines if an object is a lineString or not
     * @method isLineString
     * @param lineString {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isLineString = function(lineString, cb){

        if(!isObject(lineString)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in lineString){
            exports.isBbox(lineString.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in lineString){
            if(lineString.type !== "LineString"){
                errors.push("type must be 'LineString'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in lineString){
            exports.isLineStringCoor(lineString.coordinates, function(valid, err){
                if(!valid){
                    errors =  errors.concat(err);
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("LineString", lineString));

        return _done(cb, errors);
    };

    /**
     * Determines if an array can be interperted as coordinates for a MultiLineString
     * @method isMultiLineStringCoor
     * @param coordinates {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isMultiLineStringCoor = function(coordinates, cb) {
        var errors = [];
        if(Array.isArray(coordinates)){
            coordinates.forEach(function(val, index){
                exports.isLineStringCoor(val, function(valid, err){
                    if(!valid){
                        //modify the err msg from "isPosition" to note the element number
                        err[0] = "at "+ index+ ": ".concat(err[0]);
                        //build a list of invalide positions
                        errors = errors.concat(err);
                    }
                });
            });
        }else{
            errors.push("coordinates must be an array");
        }
        _done(cb, errors);
    };

    /**
     * Determines if an object is a MultiLine String or not
     * @method isMultiLineString
     * @param multilineString {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isMultiLineString = function(multilineString, cb){

        if(!isObject(multilineString)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in multilineString){
            exports.isBbox(multilineString.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in multilineString){
            if(multilineString.type !== "MultiLineString"){
                errors.push("type must be 'MultiLineString'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in multilineString){
            exports.isMultiLineStringCoor(multilineString.coordinates, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("MultiPoint", multilineString));

        return _done(cb, errors);
    };

    /**
     * Determines if an array is a linear Ring String or not
     * @method isMultiLineString
     * @private
     * @param coordinates {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    function _linearRingCoor(coordinates, cb) {

        var errors = [];
        if(Array.isArray(coordinates)){
            //4 or more positions

            coordinates.forEach(function(val, index){
                exports.isPosition(val, function(valid, err){
                    if(!valid){
                        //modify the err msg from "isPosition" to note the element number
                        err[0] = "at "+ index+ ": ".concat(err[0]);
                        //build a list of invalide positions
                        errors = errors.concat(err);
                    }
                });
            });

            // check the first and last positions to see if they are equivalent
            // TODO: maybe better checking?
            if(coordinates[0].toString() !== coordinates[coordinates.length -1 ].toString()){
                errors.push( "The first and last positions must be equivalent");
            }

            if(coordinates.length < 4){
                errors.push("coordinates must have at least four positions");
            }
        }else{
            errors.push("coordinates must be an array");
        }

        return _done(cb, errors);
    }

    /**
     * Determines if an array is valid Polygon Coordinates or not
     * @method _polygonCoor
     * @private
     * @param coordinates {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isPolygonCoor = function (coordinates, cb){

        var errors = [];
        if(Array.isArray(coordinates)){
            coordinates.forEach(function(val, index){
                _linearRingCoor(val, function(valid, err){
                    if(!valid){
                        //modify the err msg from "isPosition" to note the element number
                        err[0] = "at "+ index+ ": ".concat(err[0]);
                        //build a list of invalid positions
                        errors = errors.concat(err);
                    }
                });
            });
        }else{
            errors.push("coordinates must be an array");
        }

        return _done(cb, errors);
    };

    /**
     * Determines if an object is a valid Polygon
     * @method isPolygon
     * @param polygon {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isPolygon = function(polygon, cb){

        if(!isObject(polygon)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in polygon){
            exports.isBbox(polygon.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in polygon){
            if(polygon.type !== "Polygon"){
                errors.push("type must be 'Polygon'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in polygon){
            exports.isPolygonCoor(polygon.coordinates, function(valid, err) {
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("Polygon", polygon));

        return _done(cb, errors);
    };

    /**
     * Determines if an array can be interperted as coordinates for a MultiPolygon
     * @method isMultiPolygonCoor
     * @param coordinates {Array}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isMultiPolygonCoor = function(coordinates, cb) {
        var errors = [];
        if(Array.isArray(coordinates)){
            coordinates.forEach(function(val, index){
                exports.isPolygonCoor(val, function(valid, err){
                    if(!valid){
                        //modify the err msg from "isPosition" to note the element number
                        err[0] = "at "+ index+ ": ".concat(err[0]);
                        //build a list of invalide positions
                        errors = errors.concat(err);
                    }
                });
            });
        }else{
            errors.push("coordinates must be an array");
        }

        _done(cb, errors);
    };

    /**
     * Determines if an object is a valid MultiPolygon
     * @method isMultiPolygon
     * @param multiPolygon {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isMultiPolygon = function(multiPolygon, cb){

        if(!isObject(multiPolygon)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in multiPolygon){
            exports.isBbox(multiPolygon.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in multiPolygon){
            if(multiPolygon.type !== "MultiPolygon"){
                errors.push("type must be 'MultiPolygon'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in multiPolygon){
            exports.isMultiPolygonCoor(multiPolygon.coordinates, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("MultiPolygon", multiPolygon));

        return _done(cb, errors);
    };

    /**
     * Determines if an object is a valid Geometry Collection
     * @method isGeometryCollection
     * @param geometryCollection {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isGeometryCollection = function(geometryCollection, cb){

        if(!isObject(geometryCollection)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in geometryCollection){
            exports.isBbox(geometryCollection.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in geometryCollection){
            if(geometryCollection.type !== "GeometryCollection"){
                errors.push("type must be 'GeometryCollection'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('geometries' in geometryCollection){
            if(Array.isArray(geometryCollection.geometries)){
                geometryCollection.geometries.forEach(function(val, index){
                    exports.isGeometryObject(val, function(valid, err){
                        if(!valid){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("'geometries' must be an array");
            }
        }else{
            errors.push("must have a member with the name 'geometries'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("GeometryCollection", geometryCollection));

        return _done( cb, errors);
    };

    /**
     * Determines if an object is a valid Feature
     * @method isFeature
     * @param feature {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isFeature = function(feature, cb){

        if(!isObject(feature)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in feature){
            exports.isBbox(feature.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in feature){
            if(feature.type !== "Feature"){
                errors.push("type must be 'feature'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if(!('properties' in feature)){
            errors.push("must have a member with the name 'properties'");
        }

        if('geometry' in feature){
            if(feature.geometry !== null){
                exports.isGeometryObject(feature.geometry, function(valid, err){
                    if(!valid){
                        errors = errors.concat(err);
                    }
                });
            }
        }else{
            errors.push("must have a member with the name 'geometry'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("Feature", feature));

        return _done(cb, errors);
    };

    /**
     * Determines if an object is a valid Feature Collection
     * @method isFeatureCollection
     * @param featureCollection {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isFeatureCollection = function(featureCollection, cb){

        if(!isObject(featureCollection)){
            return _done(cb, ['must be a JSON Object']);
        }

        var errors = [];

        if('bbox' in featureCollection){
            exports.isBbox(featureCollection.bbox, function(valid, err){
                if(!valid){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in featureCollection){
            if(featureCollection.type !== "FeatureCollection"){
                errors.push("type must be 'FeatureCollection'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('features' in featureCollection){
            if(Array.isArray(featureCollection.features)){
                featureCollection.features.forEach(function(val, index){
                    exports.isFeature(val, function(valid, err){
                        if(!valid){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("'features' must be an array");
            }
        }else{
            errors.push("must have a member with the name 'features'");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("FeatureCollection", featureCollection));

        return _done(cb, errors);
    };

    /**
     * Determines if an object is a valid Bounding Box
     * @method isBbox
     * @param bbox {Object}
     * @param [cb] {Function} the callback
     * @return {Boolean}
     */
    exports.isBbox = function(bbox, cb){
        var errors = [];
        if(Array.isArray(bbox)){
            if(bbox.length % 2 !== 0){
                errors.push("bbox, must be a 2*n array");
            }
        }else{
            errors.push("bbox must be an array");
        }

        //run custom checks
        errors = errors.concat(_customDefinitions("Bbox", bbox));

        _done(cb,errors);
    };

    var non_geo_types = {
        "Feature": exports.isFeature,
        "FeatureCollection": exports.isFeatureCollection
    },

    geo_types = {
        "Point": exports.isPoint,
        "MultiPoint": exports.isMultiPoint,
        "LineString": exports.isLineString,
        "MultiLineString": exports.isMultiLineString,
        "Polygon": exports.isPolygon,
        "MultiPolygon": exports.isMultiPolygon,
        "GeometryCollection": exports.isGeometryCollection,
    },

    all_types = {
        "Feature": exports.isFeature,
        "FeatureCollection": exports.isFeatureCollection,
        "Point": exports.isPoint,
        "MultiPoint": exports.isMultiPoint,
        "LineString": exports.isLineString,
        "MultiLineString": exports.isMultiLineString,
        "Polygon": exports.isPolygon,
        "MultiPolygon": exports.isMultiPolygon,
        "GeometryCollection": exports.isGeometryCollection,
        "Bbox": exports.isBox,
        "Position": exports.isPosition,
        "GeoJSON": exports.isGeoJSONObject,
        "GeometryObject": exports.isGeometryObject
    };

    exports.all_types = all_types;

})(typeof exports === 'undefined'? this['GJV']={}: exports);

},{}],19:[function(require,module,exports){
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')

module.exports = function(divId, conf, callback) {
	html.init(divId, conf, function() {
		ctrl.init(function(r) {
			callback(r)
		})
	})
}

},{"./lib/ctrl":20,"./lib/html":21}],20:[function(require,module,exports){
exports.init = function(callback) {
	document.getElementById('add-csv').onclick = function() {
		callback('add-csv')
	}
	document.getElementById('rm').onclick = function() {
		callback('rm')
	}
}

},{}],21:[function(require,module,exports){
exports.init = function(divId, conf, callback) {
	var html = ''
	if(conf.modif) { html = html + '<p class="small">Continue with edited collection</p>' }
	html = html 
		+ '<button id="add-csv">Add from CSV</button>'
		+ '<button id="rm">Remove properties</button>'

	document.getElementById(divId).innerHTML = html
	callback()
}

},{}],22:[function(require,module,exports){
var geo = require('../utils/geo')
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var parseCsv = require('./lib/parse')
var Emitter = require('events').EventEmitter
var drop = require('../drop-zone-csv')
var utils = require('./lib/utils')
var save = require('../utils/save')

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	var conf = {}
	conf.feats = data.features
	conf.geoProps = geo.getAllProperties(data.features)

	drop(divId, function(csvData) {
		html.parsing(divId, function() {
			parseCsv(csvData, function(result) {
				utils.checkParsed(evt, result)
			})
		})
	})

	evt.on('parse-errors', function(errs) {
		html.parseErrors(divId, errs)
	})

	evt.on('parse-success', function(csv) {
		conf.csv = csv
		html.header(divId, csv[0], function() {
			ctrl.header(evt)
		})
	})

	evt.on('is-not-head', function() {
		html.setHead(divId, conf.csv[0], function() {
			ctrl.setHead(evt, conf.csv[0].length)
		})
	})

	evt.on('is-head', function() {
		evt.emit('got-header', conf.csv[0], true)
	})

	evt.on('got-header', function(head, removeFirst) {
		conf.head = head
		if(removeFirst) { conf.csv.splice(0,1) }
		conf.csvJson = utils.csvToJson(conf.head, conf.csv)
		html.joinProps(divId, conf.geoProps, conf.head, function() {
			ctrl.joinProps(evt)
		})
	})

	evt.on('join-props', function(geoProp, csvProp) {
		conf.joinProps = { geo: geoProp, csv: csvProp }
		html.joining(divId, function() {
			utils.joinThem(evt, conf.feats, conf.csvJson, conf.joinProps)
		})
	})

	evt.on('joined', function(col) {
		conf.joined = col
		html.done(divId, function() {
			ctrl.done(evt)
		})
	})

	evt.on('save', function() {
		save.json('edited.json', conf.joined)
		callback(null)
	})

	evt.on('continue', function() {
		callback(conf.joined)
	})
}



},{"../drop-zone-csv":3,"../utils/geo":31,"../utils/save":36,"./lib/ctrl":23,"./lib/html":24,"./lib/parse":25,"./lib/utils":26,"events":1}],23:[function(require,module,exports){
exports.header = function(evt) {
	var yes = document.getElementById('csv-header-yes')
	var no = document.getElementById('csv-header-no')
	yes.onclick = function() {
		evt.emit('is-head')
	}
	no.onclick = function() {
		evt.emit('is-not-head')
	}
}

exports.setHead = function(evt, nbColumns) {
	var inputIds = []
	for(i=0;i<nbColumns;i++) {
		inputIds.push('set-head-input-' + i)
	}
	var inputs = []
	inputIds.forEach(function(id) {
		var el = document.getElementById(id)
		inputs.push(el)
	})
	var btn = document.getElementById('set-head-done')
	btn.onclick = function() {
		var vals = []
		inputs.forEach(function(input, inputIndex) {
			var val = input.value
			if(val) { vals.push(val) }
		})
		if(vals.length === nbColumns) {
			evt.emit('got-header', vals, false)
		} else {
			document.getElementById('set-head-error').innerHTML = 'All column names need to be filled'
		}
	}
}

exports.joinProps = function(evt) {
	document.getElementById('join-btn').onclick = function() {
		var geo = document.getElementById('geo-props').value
		var csv = document.getElementById('csv-props').value
		evt.emit('join-props', geo, csv)
	}
}

exports.done = function(evt) {
	document.getElementById('save').onclick = function() {
		evt.emit('save')
	}
	document.getElementById('continue').onclick = function() {
		evt.emit('continue')
	}
}

},{}],24:[function(require,module,exports){
exports.parsing = function(divId, callback) {
	document.getElementById(divId).innerHTML = '<p>Parsing...</p>'
	callback()
}

exports.parseErrors = function(divId, errs) {
	var html = '<p>'
		+ 'Could not parse file.'
		+ '<br/>'
		+ '<b>Errors</b>:<br/>'
	errs.forEach(function(err) {
		var s = JSON.stringify(err)
		html = html + s + '</br>'
	})
	html = html + '</p>'

	document.getElementById(divId).innerHTML = html
}

exports.header = function(divId, arr, callback) {
	var html = '<p>This is the first line:</p>'
	arr.forEach(function(col, i) {
		html = html + '<p class="fake-table-cell">' + col + '</p>'
	})
	html = html + '<p>'
		+ 'Are these the names of the columns?</p>'
		+ '<button id="csv-header-yes">Yes</button>'
		+ '<button id="csv-header-no">No</button>'

	document.getElementById(divId).innerHTML = html
	callback()
}

exports.setHead = function(divId, arr, callback) {
	var html = '<p>Name the columns</p>'
		+ '<table>'
			+ '<tr>'
				+ '<th>First row</th>'
				+ '<th>Column name</th>'
			+ '</tr>'
	arr.forEach(function(c,i) {
		html = html + '<tr>'
			+ '<td>' + c + '</td>'
			+ '<td>'
				+ '<input id="set-head-input-' + i + '">'
			+ '</td>'
		+ '</tr>'
		+ '<p id="set-head-error"></p>'
	})
	html = html + '</table>'
		+ '<button id="set-head-done">Done</button>'

	document.getElementById(divId).innerHTML = html
	callback()	
}

exports.joinProps = function(divId, geoProps, csvProps, callback) {
	var html = '<p>Properties to use for join</p>'
		+ '<p><b>In the GeoJSON file</b></p>'
		+ '<select id="geo-props">'
	geoProps.forEach(function(gp) {
			html = html + '<option value="' + gp + '">' + gp + '</option>'
	})
	html = html
		+ '</select>'
		+ '<p><b>In the CSV file</b></p>'		
		+ '<select id="csv-props">'
	csvProps.forEach(function(cp) {
			html = html + '<option value="' + cp + '">' + cp + '</option>'
	})
	html = html
		+ '</select>'
		+ '<button id="join-btn">OK</button>'
	document.getElementById(divId).innerHTML = html
	callback()	
}

exports.joining = function(divId, callback) {
	var html = '<p><b>Joining...</b></p>'
	document.getElementById(divId).innerHTML = html
	callback()	
}

exports.done = function(divId, callback) {
	var html = '<p><b>Properties have been added</b></p>'
		+ '<button id="save">Save collection</button>'
		+ '<button id="continue">Continue editing</button>'
	document.getElementById(divId).innerHTML = html
	callback()
}


},{}],25:[function(require,module,exports){
var Papa = require('papaparse')

module.exports = function(data, callback) {
	Papa.parse(data, {
		complete: function(results) {
			callback(results)
		}
	})
}

},{"papaparse":37}],26:[function(require,module,exports){
exports.checkParsed = function(evt, parsed) {
	if(parsed.errors.length > 0) {
		evt.emit('parse-errors', parsed.errors)
	} else {
		evt.emit('parse-success', parsed.data)
	}
}

exports.csvToJson = function(head, lines) {
	var arr = []
	lines.forEach(function(l) {
		var obj = {}
		l.forEach(function(v, vI) {
			obj[head[vI]] = v
		})
		arr.push(obj)
	})
	return arr
}

exports.joinThem = function(evt, feats, csvJson, joiner) {
	var newFeats = []
	feats.forEach(function(f) {
		var line = findLine(f, csvJson, joiner)
		newFeats.push(addProps(f, line))
	})
	evt.emit('joined', {type: 'FeatureCollection', features: newFeats})
}

function findLine(f, csvJson, joiner) {
	var val = f.properties[joiner.geo]
	var num = !isNaN(val)
	var r = null
	csvJson.forEach(function(csv) {
		if(num) { if(+csv[joiner.csv] === +val) { r = csv } } 
		else { if(csv[joiner.csv] === val) { r = csv } }
	})
	return r
}

function addProps(f, line) {
	for(k in line) {
		f.properties[k] = line[k]
	}
	return f
}

},{}],27:[function(require,module,exports){
var geo = require('../utils/geo')
var html = require('./lib/html')
var ctrl = require('./lib/ctrl')
var save = require('../utils/save')
var Emitter = require('events').EventEmitter
var process = require('./lib/process')

module.exports = function(divId, data, callback) {
	var evt = new Emitter()
	var props = geo.getAllProperties(data.features)

	html.init(divId, props, function() {
		ctrl.init(evt)
	})

	var newCol
	evt.on('props-to-keep', function(props) {
		process(data.features, props, function(feats) { 
			newCol = {type: 'FeatureCollection', features: feats}
			html.done(divId, function() {
				ctrl.done(evt)
			})
		})
	})

	evt.on('save', function() {
		save.json('edited.json', newCol)
		callback(null)
	})

	evt.on('continue', function() {
		callback(newCol)
	})
}

},{"../utils/geo":31,"../utils/save":36,"./lib/ctrl":28,"./lib/html":29,"./lib/process":30,"events":1}],28:[function(require,module,exports){
exports.init = function(evt) {
	document.getElementById('rm-selected').onclick = function() {
		var vals = getChecked(false)
		evt.emit('props-to-keep', vals)
	}	
	document.getElementById('rm-unselected').onclick = function() {
		var vals = getChecked(true)
		evt.emit('props-to-keep', vals)
	}
}

exports.done = function(evt) {
	document.getElementById('save').onclick = function() {
		evt.emit('save')
	}
	document.getElementById('continue').onclick = function() {
		evt.emit('continue')
	}
}


function getChecked(bool) {
	var cbs = document.getElementsByClassName('checkbox-input')
	var checked = []
	var notChecked = []
	for(i=0;i<cbs.length;i++) {
		if(cbs[i].checked) { checked.push(cbs[i].id) } else { notChecked.push(cbs[i].id) }
	}
	if(bool) { return checked }
	else { return notChecked }
}

},{}],29:[function(require,module,exports){
exports.init = function(divId, props, callback) {
	var html = '<p><b>Choose properties</b></p>'
		+ '<div class="scroll-y">'
	props.forEach(function(p) {
		html = html + '<div class="checkbox-item">'
			+ '<input id="' + p + '" class="checkbox-input" type="checkbox">'
			+ '<span>' + p + '</span>'
		+ '</div>' 
	})
	html = html
		+ '</div>'
		+ '<button id="rm-selected">Remove selected</button>'
		+ '<button id="rm-unselected">Remove not selected</button>'
	document.getElementById(divId).innerHTML = html
	callback()
}

exports.done = function(divId, callback) {
	var html = '<p><b>Properties have been removed</b></p>'
		+ '<button id="save">Save collection</button>'
		+ '<button id="continue">Continue editing</button>'
	document.getElementById(divId).innerHTML = html
	callback()
}

},{}],30:[function(require,module,exports){
module.exports = function(feats, props, callback) {
	var newFeats = []
	feats.forEach(function(f) {
		var newProps = {}
		props.forEach(function(p) { newProps[p] = f.properties[p] })
		f.properties = newProps
		newFeats.push(f)
	})
	callback(newFeats)
}

},{}],31:[function(require,module,exports){
var util = require('./lib/utils')

var getAllPoints = require('./lib/get-all-points')
exports.getAllPoints = function(data) {
	if(data.type === 'FeatureCollection') { return getAllPoints.fromFeatureCollection(data) }
	else if(data.type === 'Feature') { return getAllPoints.fromFeature(data) }
	else if(util.isGeom(data)) { return getAllPoints.fromGeometry(data) }
}

var getBbox = require('./lib/get-bbox')
exports.getBbox = function(data) {
	if(data.type === 'FeatureCollection') { return getBbox.fromFeatureCollection(data) }
	else if(data.type === 'Feature') { return getBbox.fromFeature(data) }
	else if(util.isGeom(data)) { return getBbox.fromGeometry(data) }
}

var properties = require('./lib/properties')
exports.getAllProperties = function(feats) { return properties.getAll(feats) }
exports.getPropertyValues = function(feats, property) { return properties.getValues(feats, property) }
exports.getUniqPropertyValues = function(feats, property) { return properties.getUniqValues(feats, property) }
exports.numericValues = function(feats, property) { return properties.numericValues(feats, property) }
exports.propInfo = function(collection) { return properties.propInfo(collection.features) }



},{"./lib/get-all-points":32,"./lib/get-bbox":33,"./lib/properties":34,"./lib/utils":35}],32:[function(require,module,exports){
exports.fromFeature = function(feature) {
	return getPoints(feature.geometry)
}

exports.fromGeometry = function(geometry) {
	return getPoints(geometry)
}

exports.fromFeatureCollection = function(col) {
	var pts = []
	col.features.forEach(function(f) {
		var fPts = getPoints(f.geometry)
		fPts.forEach(function(pt) { pts.push(pt) })
	})
	return pts
}

function getPoints(geometry) {
	var g = geometry
	if(g.type === 'Point') { return [g.coordinates] }
	else if(g.type === 'LineString' || g.type === 'MultiPoint') { return g.coordinates }
	else if(g.type === 'Polygon' || g.type === 'MultiLineString') {
		var pts = []
		g.coordinates.forEach(function(part) {
			part.forEach(function(pt) { pts.push(pt) })
		})
		return pts
	} else if(g.type === 'MultiPolygon') {
		var pts = []
		g.coordinates.forEach(function(poly) {
			poly.forEach(function(part) {
				part.forEach(function(pt) {
					pts.push(pt)
				})
			})
		})
		return pts
	} else {
		console.log('point-array ERROR: \"' + g.type + '\" is not a valid geometry type')
	}
}

},{}],33:[function(require,module,exports){
var getAllPoints = require('./get-all-points')

exports.fromFeature = function(feat) {
	return getBbox(getAllPoints.fromFeature(feat))
}

exports.fromFeatureCollection = function(col) {
	return getBbox(getAllPoints.fromFeatureCollection(col))
}

exports.fromGeometry = function(geom) {
	return getBbox(getAllPoints.fromGeometry(geom))
}

function getBbox(points) {
	var x = { min: Infinity, max: -Infinity }
	var y = { min: Infinity, max: -Infinity }
	points.forEach(function(pt) {
		if(pt[0] > x.max) { x.max = pt[0] }
		if(pt[0] < x.min) { x.min = pt[0] }
		if(pt[1] > y.max) { y.max = pt[1] }
		if(pt[1] < y.min) { y.min = pt[1] }
	})
	return [x.min, y.min, x.max, y.max]
}

},{"./get-all-points":32}],34:[function(require,module,exports){
var util = require('./utils')

exports.getAll = function(feats) { return getAll(feats) }

function getAll(feats) {
	var props = []
	for(k in feats[0].properties) { props.push(k) }
	return props
}

exports.getValues = function(feats, property) { return getValues(feats, property) }

function getValues(feats, property) {
	var vals = []
	feats.forEach(function(f) {
		vals.push(f.properties[property])
	})
	return vals.sort(function(a,b) {return a - b })
}

exports.getUniqValues = function(feats, property) { return getUniqValues(feats, property) }

function getUniqValues(feats, property) {
	var vals = []
	feats.forEach(function(f) {
		vals.push(f.properties[property])
	})
	return util.uniq(vals)
}

exports.numericValues = function(feats, property) { return numericValues(feats, property) }

function numericValues(feats, property) {
	var r = true
	feats.forEach(function(f) {
		if(f.properties[property]) {
			if(isNaN(f.properties[property])) { r = false }
		}
	})
	return r
}

exports.propInfo = function(feats) {
	var properties = []
	var props = geo.getAllProperties(o.feats)
	props.forEach(function(prop) {
		var obj = {
			key: prop,
			uniqValues: getUniqValues(o.feats, prop),
			isNum: numericValues(o.feats, prop)
		}
		obj.maxValue = obj.uniqValues[0]
		obj.minValue = obj.uniqValues[obj.uniqValues.length - 1]
		obj.nbUniqValues = obj.uniqValues.length

		properties.push(obj)
	})
	return properties
}



},{"./utils":35}],35:[function(require,module,exports){
exports.isGeom = function(geometry) {
	var r = false
	var types = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']
	types.forEach(function(t) {
		if(geometry.type === t) { r = true }
	})
	return r
}

exports.uniq = function(arr) {
	var uniq = []
	var isNum = true
	arr.forEach(function(val) {
		if(isNaN(val)) { isNum = false } 
		var exist = false
		uniq.forEach(function(uVal) {
			if(val === uVal) { exist = true }
		})
		if(!exist) { uniq.push(val) }
	})
	if(isNum) {
		uniq = uniq.map(function(v) { return +v })
	}
	uniq.sort(function(a, b) {
		if(a > b) { return 1 }
		else { return -1 }
	})
	return uniq
}


},{}],36:[function(require,module,exports){
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


},{}],37:[function(require,module,exports){
/*!
	Papa Parse
	v4.1.2
	https://github.com/mholt/PapaParse
*/
(function(global)
{
	"use strict";

	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = "\ufeff";
	Papa.BAD_DELIMITERS = ["\r", "\n", "\"", Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ",";			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;

	if (typeof module !== 'undefined' && module.exports)
	{
		// Export to Node...
		module.exports = Papa;
	}
	else if (isFunction(global.define) && global.define.amd)
	{
		// Wireup with RequireJS
		define(function() { return Papa; });
	}
	else
	{
		// ...or as browser global
		global.Papa = Papa;
	}

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() == "INPUT"
								&& $(this).attr('type').toLowerCase() == "file"
								&& global.FileReader;

				if (!supported || !this.files || this.files.length == 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length == 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action == "abort")
						{
							error("AbortError", f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action == "skip")
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned == "skip")
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		}
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function () {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		var _output = "";
		var _fields = [];

		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** delimiting character */
		var _delimiter = ",";

		/** newline character(s) */
		var _newline = "\r\n";

		unpackConfig();

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				return serialize(null, _input);
			else if (typeof _input[0] === 'object')
				return serialize(objectKeys(_input[0]), _input);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					_input.fields = _input.data[0] instanceof Array
									? _input.fields
									: objectKeys(_input.data[0]);

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ["asdf"]
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw "exception: Unable to serialize unrecognized input";


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length == 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) == -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				_quotes = _config.quotes;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = "";

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						csv += _delimiter;
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					csv += _newline;
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === "undefined" || str === null)
				return "";

			str = str.toString().replace(/"/g, '""');

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) == ' '
							|| str.charAt(str.length - 1) == ' ';

			return needsQuotes ? '"' + str + '"' : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._paused = false;
		this._finished = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = "";
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = "";

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);
			
			if (this._handle.paused() || this._handle.aborted())
				return;
			
			var lastIndex = results.meta.cursor;
			
			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk))
			{
				this._config.chunk(results, this._handle);
				if (this._paused)
					return;
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
				this._config.complete(this._completeResults);

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();
			
			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open("GET", this._input, !IS_WORKER);
			
			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader("Range", "bytes="+this._start+"-"+end);
				xhr.setRequestHeader("If-None-Match", "webkit-no-cache"); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status == 0)
				this._chunkError();
			else
				this._start += this._config.chunkSize;
		}

		this._chunkLoaded = function()
		{
			if (xhr.readyState != 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		}

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(errorText);
		}

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader("Content-Range");
			return parseInt(contentRange.substr(contentRange.lastIndexOf("/") + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		}

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		}

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		}

		this._chunkError = function()
		{
			this._sendError(reader.error);
		}

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var string;
		var remaining;
		this.stream = function(s)
		{
			string = s;
			remaining = s;
			return this._nextChunk();
		}
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		}
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;



	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;   // Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length == 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else
						userStep(_results, self);
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				_config.newline = guessLineEndings(input);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input);
		};

		this.aborted = function () {
			return _aborted;
		}

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = "";
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '"+Papa.DefaultDelimiter+"'");
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (_results.data[i].length == 1 && _results.data[i][0] == "")
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTyping();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length == 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				for (var j = 0; j < _results.data[i].length; j++)
					_fields.push(_results.data[i][j]);
			_results.data.splice(0, 1);
		}

		function applyHeaderAndDynamicTyping()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping))
				return _results;

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = {};

				for (var j = 0; j < _results.data[i].length; j++)
				{
					if (_config.dynamicTyping)
					{
						var value = _results.data[i][j];
						if (value == "true" || value == "TRUE")
							_results.data[i][j] = true;
						else if (value == "false" || value == "FALSE")
							_results.data[i][j] = false;
						else
							_results.data[i][j] = tryParseFloat(value);
					}

					if (_config.header)
					{
						if (j >= _fields.length)
						{
							if (!row["__parsed_extra"])
								row["__parsed_extra"] = [];
							row["__parsed_extra"].push(_results.data[i][j]);
						}
						else
							row[_fields[j]] = _results.data[i][j];
					}
				}

				if (_config.header)
				{
					_results.data[i] = row;
					if (j > _fields.length)
						addError("FieldMismatch", "TooManyFields", "Too many fields: expected " + _fields.length + " fields but parsed " + j, i);
					else if (j < _fields.length)
						addError("FieldMismatch", "TooFewFields", "Too few fields: expected " + _fields.length + " fields but parsed " + j, i);
				}
			}

			if (_config.header && _results.meta)
				_results.meta.fields = _fields;
			return _results;
		}

		function guessDelimiter(input)
		{
			var delimChoices = [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					delimiter: delim,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= preview.data.length;

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			}
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024*1024);	// max length 1 MB

			var r = input.split('\r');

			if (r.length == 1)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] == '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function tryParseFloat(val)
		{
			var isNumber = FLOAT.test(val);
			return isNumber ? parseFloat(val) : val;
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ",";

		// Comment character must be valid
		if (comments === delim)
			throw "Comment character same as delimiter";
		else if (comments === true)
			comments = "#";
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline != '\n' && newline != '\r' && newline != '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw "Input must be a string";

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = typeof step === 'function';

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf('"') === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substr(0, commentsLen) == comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] == '"')
				{
					// Start our search for the closing quote where the cursor is
					var quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						var quoteSearch = input.indexOf('"', quoteSearch+1);

						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: "Quotes",
									code: "MissingQuotes",
									message: "Quoted field unterminated",
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						if (quoteSearch === inputLen-1)
						{
							// Closing quote at EOF
							var value = input.substring(cursor, quoteSearch).replace(/""/g, '"');
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						if (input[quoteSearch+1] == '"')
						{
							quoteSearch++;
							continue;
						}

						if (input[quoteSearch+1] == delim)
						{
							// Closing quote followed by delimiter
							row.push(input.substring(cursor, quoteSearch).replace(/""/g, '"'));
							cursor = quoteSearch + 1 + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						if (input.substr(quoteSearch+1, newlineLen) === newline)
						{
							// Closing quote followed by newline
							row.push(input.substring(cursor, quoteSearch).replace(/""/g, '"'));
							saveRow(quoteSearch + 1 + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}
							
							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}
					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline == -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substr(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [], errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			);
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append "papaworker" to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw "Not implemented.";
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object')
			return obj;
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}
})(typeof window !== 'undefined' ? window : this);

},{}]},{},[2]);
