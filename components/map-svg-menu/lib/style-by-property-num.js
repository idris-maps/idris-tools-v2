module.exports = function(menu, index, sbp) {
	view(menu, index, sbp, function() {
		ctrl(menu, index, sbp)
	})
}

function view(menu, index, sbp, callback) {
	var html = '<h2>Style by property</h2>'
		+ '<p><b>' + sbp.property + '</b> is numeric</p>'
		+ '<button id="by-scale">Style by rules</button>'
		+ '<button id="manual">Style by hand</button>'
	menu.div.innerHTML = html
	callback()
}

function ctrl(menu, index, sbp) {
	document.getElementById('by-scale').onclick = function() {
		menu.styleByPropertyRule(index, sbp)
	}
	document.getElementById('manual').onclick = function() {
		menu.styleByPropertyManual(index, sbp)
	}
}
