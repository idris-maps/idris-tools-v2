var msg = require('./msg')
var read = require('./read-text')

module.exports = function(file, evt) {
	msg.write('Verifying document...')
	if(isSVG(file)) {
		read(file, function(svg) {
			var obj = {
				name: getName(file),
				svg: svg
			}
			evt.emit('svg-dropped', obj)
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

function isSVG(file) {
	if(file.type === 'image/svg+xml') {
		msg.write('Document is an SVG file')
		return true
	} else {
		msg.write('Document is not an SVG file')
		return false
	}
}

