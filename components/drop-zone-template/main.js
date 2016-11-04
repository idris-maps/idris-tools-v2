var html = require('./lib/html')
var init = require('./lib/init')
var browse = require('./lib/browse')

window.onload = function() {
	html.init('whatever', function() {
		init()
		var browseBtn = document.getElementById('browse-btn')
		browseBtn.onclick = function() {
			html.browse('whatever', function() {
				browse()
			})
		}
	})
}
