exports.parsing = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<p>Parsing...</p>'
	callback()
}

exports.parseErrors = function(divId, errs) {
	var html = '<p>'
		+ 'Could not parse file.'
		+ '<br/>'
		+ '<b>Errors</b>:<br/>'
	errs.forEach(function(err) {
		var s = JSON.stringify(err)
		html = html + s + '</br>'
	})
	html = html + '</p>'

	var el = document.getElementById(divId)
	el.innerHTML = html
}

exports.header = function(divId, arr, callback) {
	var html = '<p>This is the first line:</p>'
	arr[0].forEach(function(col, i) {
		html = html + '<p class="fake-table-cell">' + col + '</p>'
	})
	html = html + '<p>'
		+ 'Are these the names of the columns?</p>'
		+ '<button id="csv-header-yes">Yes</button>'
		+ '<button id="csv-header-no">No</button>'

	var el = document.getElementById(divId)
	el.innerHTML = html
	callback()
}

exports.setHead = function(divId, arr, callback) {
	var html = '<p>Name the columns</p>'
		+ '<table>'
			+ '<tr>'
				+ '<th>First row</th>'
				+ '<th>Column name</th>'
			+ '</tr>'
	arr[0].forEach(function(c,i) {
		html = html + '<tr>'
			+ '<td>' + c + '</td>'
			+ '<td>'
				+ '<input id="set-head-input-' + i + '">'
			+ '</td>'
		+ '</tr>'
		+ '<p id="set-head-error"></p>'
	})
	html = html + '</table>'
		+ '<button id="set-head-done">Done</button>'

	var el = document.getElementById(divId)
	el.innerHTML = html
	callback()	
}

exports.geoCol = function(divId, callback) {
	var el = document.getElementById(divId)
	el.innerHTML = '<p>How is the geographic data presented?</p>'
		+ '<button id="csv-lat-lng">Lat / Lng</button>'
		+ '<button id="csv-wkt">WKT</button>'
		+ '<p>Use <b>Lat / Lng</b> if you have two columns with latitude and longitude</p>'
		+ '<p>Use <b>WKT</b> if you have one column with a <a href="https://en.wikipedia.org/wiki/Well-known_text">WKT</a> string</p>'
	callback()
}

exports.llCol = function(divId, head, callback) {
	var el = document.getElementById(divId)
	var html = '<p>Choose which column corresponds to</p>'
		+ '<p><b>Latitude</b></p>'
		+ '<select id="select-lat">'
		head.forEach(function(col, i) {
			html = html + '<option value="' + i + '">' + col + '</option>'
		}) 
		html = html + '</select>'
		+ '<p><b>Longitude</b></p>'
		+ '<select id="select-lng">'
		head.forEach(function(col, i) {
			html = html + '<option value="' + i + '">' + col + '</option>'
		}) 
		html = html + '</select><br/>'
		+ '<button id="ll-col-done">Done</button>'
	el.innerHTML = html
	callback()
}

exports.wktCol = function(divId, head, callback) {
	var el = document.getElementById(divId)
	var html = '<p>Choose which column corresponds to <b>WKT</b></p>'
		+ '<select id="select-wkt">'
		head.forEach(function(col, i) {
			html = html + '<option value="' + i + '">' + col + '</option>'
		}) 
		html = html + '</select><br/>'
		+ '<button id="wkt-col-done">Done</button>'
	el.innerHTML = html
	callback()
}
