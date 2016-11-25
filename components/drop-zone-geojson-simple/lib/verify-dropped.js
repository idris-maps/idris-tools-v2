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
