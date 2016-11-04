exports.header = function(callback) {
	var yes = document.getElementById('csv-header-yes')
	var no = document.getElementById('csv-header-no')
	yes.onclick = function() {
		callback(true)
	}
	no.onclick = function() {
		callback(false)
	}
}

exports.setHead = function(nbColumns, callback) {
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
			console.log(input)
			var val = input.value
			if(val) { vals.push(val) }
		})
		if(vals.length === nbColumns) {
			callback(vals)
		} else {
			document.getElementById('set-head-error').innerHTML = 'All column names need to be filled'
		}
	}
}

exports.geoCol = function(callback) {
	var ll = document.getElementById('csv-lat-lng')
	var wkt = document.getElementById('csv-wkt')
	ll.onclick = function() {
		callback(false)
	}
	wkt.onclick = function() {
		callback(true)
	}
}

exports.llCol = function(callback) {
	var lat = document.getElementById('select-lat')
	var lng = document.getElementById('select-lng')
	var btn = document.getElementById('ll-col-done')
	btn.onclick = function() {
		callback(+lng.value, +lat.value)
	}
}

exports.wktCol = function(callback) {
	var wkt = document.getElementById('select-wkt')
	var btn = document.getElementById('wkt-col-done')
	btn.onclick = function() {
		callback(+wkt.value)
	}
}
