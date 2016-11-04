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
