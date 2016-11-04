module.exports = function(menu, index) {
	view(menu, index, function(data) {
		ctrl(menu, index, data)
	})
}

function view(menu, index, callback) {
	var data = menu.map.layers[index].getData()
	var html = '<h2>' + data.name + '</h2>'
		+ '<p><b>Layer style</b></p>'
		+ '<table class="layer-style-table">'
	for(k in data.style.layer) {
		html = html + '<tr>'
			+ '<td><p>' + k + '</p></td>'
			+ '<td><input id="' + k + '" class="style-input" value="' + data.style.layer[k] + '"></td>'
			+ '</tr>'
	}
	html = html + '</table>'
		+ '<button id="change-style">Change layer style</button><br/><br/>'
		+ viewSbpTable(menu, index)
		+ '<button id="style-by-property">Add style by property</button>'
	if(data.type === 'point') { html = html + '<button id="set-type-as-label">Show as label</button>' }
	if(data.type === 'label') { html = html + '<button id="set-type-as-point">Show as points</button>' }

	html = html	
		+ '<button id="delete-layer" class="red-btn">Delete layer</button>'
	menu.div.innerHTML = html
	callback(data)
}

function viewSbpTable(menu, index) {
	var html = ''
	var sbp = menu.map.layers[index].styleByFeat
	if(sbp.length !== 0) {
		html = html + '<p><b>Style by property</b></p>'
			+ '<table id="sbp-list">'
				+ '<tr class="table-head"><td>Property</td><td>Style</td><td>Remove</td></tr>'
		sbp.forEach(function(x, sbpI) {
			html = html + '<tr class="sbp-item">'
				+ '<td>' + x.property + '</td><td>' + x.type + '</td><td class="del-sbp" id="del-sbp-' + sbpI + '">X</td></tr>'
		})
		html = html + '</table><br/><br/>'
	}
	return html
}

function ctrl(menu, index, data) {
	var inputs = document.getElementsByClassName('style-input')
	document.getElementById('change-style').onclick = function() {
		var s = {}
		for(i=0;i<inputs.length;i++) { s[inputs[i].id] = inputs[i].value }
		menu.close()
		menu.map.setLayerStyle(index, fixStyle(s))
	}
	document.getElementById('delete-layer').onclick = function() {
		menu.map.removeLayer(index)
		menu.close()
	}
	document.getElementById('style-by-property').onclick = function() {
		menu.styleByProperty(index)
	}
	if(data.type === 'point') {
		document.getElementById('set-type-as-label').onclick = function() {
			menu.labelProperty(index)
		}
	}
	if(data.type === 'label') {
		document.getElementById('set-type-as-point').onclick = function() {
			menu.map.switchPointType(index)
			menu.close()
		}
	}
	ctrlSbpTable(menu, index)
}

function ctrlSbpTable(menu, index) {
	var sbp = menu.map.layers[index].styleByFeat
	if(sbp.length !== 0) {
		var delBtns = document.getElementsByClassName('del-sbp')
		var btns = []
		for(i=0;i<delBtns.length;i++) {
			btns.push(delBtns[i])
		}
		btns.forEach(function(btn, bI) {
			btn.addEventListener('click', function() {
				menu.map.removeStyleByFeature(index, bI)
				menu.close()
			})
		})
	}
}

function fixStyle(s) {
	if(s['stroke-width']) { s['stroke-width'] = +s['stroke-width'] }
	if(s['r']) { s['r'] = +s['r'] }
	if(s['font-size']) { s['font-size'] = +s['font-size'] }
	if(s['fill-opacity']) {
		s['fill-opacity'] = +s['fill-opacity']
		if(s['fill-opacity'] > 1) { s['fill-opacity'] = 1 }
		else if(s['fill-opacity'] < 0) { s['fill-opacity'] = 0 } 
	}
	if(s['stroke-opacity']) {
		s['stroke-opacity'] = +s['stroke-opacity']
		if(s['stroke-opacity'] > 1) { s['stroke-opacity'] = 1 }
		else if(s['stroke-opacity'] < 0) { s['stroke-opacity'] = 0 } 
	}
	return s
}
