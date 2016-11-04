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
