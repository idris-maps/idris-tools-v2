var msg = require('./msg')
var read = require('./read-zip')


module.exports = function(file, evt) {
	msg.write('Verifying document...')
	if(isZIP(file)) {
		msg.write('Converting...')
		read(file, function(buffer) {
			evt.emit('got-zip-buffer', buffer)
		})
	}
}

function isZIP(file) {
	if(file.type === 'application/zip') {
		msg.write('Document is a ZIP file')
		return true
	} else {
		msg.write('Document is not a ZIP file')
		return false
	}
}


