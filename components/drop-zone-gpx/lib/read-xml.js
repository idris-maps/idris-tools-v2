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
