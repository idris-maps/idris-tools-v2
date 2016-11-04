module.exports = function(file, callback) {
	var reader = new FileReader()
	reader.onload = function() {
		callback(reader.result)
	}
	reader.readAsText(file)
}
