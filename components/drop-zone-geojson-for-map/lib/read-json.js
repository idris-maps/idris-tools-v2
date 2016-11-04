module.exports = function(file, callback) {
	var reader = new FileReader()
	reader.onload = function() {
		callback(JSON.parse(reader.result))
	}
	reader.readAsText(file)
}
