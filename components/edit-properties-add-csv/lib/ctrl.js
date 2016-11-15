exports.header = function(evt) {
	var yes = document.getElementById('csv-header-yes')
	var no = document.getElementById('csv-header-no')
	yes.onclick = function() {
		evt.emit('is-head')
	}
	no.onclick = function() {
		evt.emit('is-not-head')
	}
}

exports.setHead = function(evt, nbColumns) {
	var inputIds = []
	for(i=0;i<nbColumns;i++) {
		inputIds.push('set-head-input-' + i)
	}
	var inputs = []
	inputIds.forEach(function(id) {
		var el = document.getElementById(id)
		inputs.push(el)
	})
	var btn = document.getElementById('set-head-done')
	btn.onclick = function() {
		var vals = []
		inputs.forEach(function(input, inputIndex) {
			var val = input.value
			if(val) { vals.push(val) }
		})
		if(vals.length === nbColumns) {
			evt.emit('got-header', vals, false)
		} else {
			document.getElementById('set-head-error').innerHTML = 'All column names need to be filled'
		}
	}
}

exports.joinProps = function(evt) {
	document.getElementById('join-btn').onclick = function() {
		var geo = document.getElementById('geo-props').value
		var csv = document.getElementById('csv-props').value
		evt.emit('join-props', geo, csv)
	}
}

exports.done = function(evt) {
	document.getElementById('save').onclick = function() {
		evt.emit('save')
	}
	document.getElementById('continue').onclick = function() {
		evt.emit('continue')
	}
}
