module.exports = function(callback) {
	var area = document.getElementById('paste-area')
	var btn = document.getElementById('paste-done')
	var err = document.getElementById('paste-error')
	btn.onclick = function() {
		console.log('click')
		if(area.value) { callback(area.value) }
		else { err.innerHTML = 'Paste area is empty' }
	}
}
