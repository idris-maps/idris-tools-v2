exports.parsing = function(divId, callback) {
	document.getElementById(divId).innerHTML = '<p>Parsing...</p>'
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

	document.getElementById(divId).innerHTML = html
}

exports.header = function(divId, arr, callback) {
	var html = '<p>This is the first line:</p>'
	arr.forEach(function(col, i) {
		html = html + '<p class="fake-table-cell">' + col + '</p>'
	})
	html = html + '<p>'
		+ 'Are these the names of the columns?</p>'
		+ '<button id="csv-header-yes">Yes</button>'
		+ '<button id="csv-header-no">No</button>'

	document.getElementById(divId).innerHTML = html
	callback()
}

exports.setHead = function(divId, arr, callback) {
	var html = '<p>Name the columns</p>'
		+ '<table>'
			+ '<tr>'
				+ '<th>First row</th>'
				+ '<th>Column name</th>'
			+ '</tr>'
	arr.forEach(function(c,i) {
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

	document.getElementById(divId).innerHTML = html
	callback()	
}

exports.joinProps = function(divId, geoProps, csvProps, callback) {
	var html = '<p>Properties to use for join</p>'
		+ '<p><b>In the GeoJSON file</b></p>'
		+ '<select id="geo-props">'
	geoProps.forEach(function(gp) {
			html = html + '<option value="' + gp + '">' + gp + '</option>'
	})
	html = html
		+ '</select>'
		+ '<p><b>In the CSV file</b></p>'		
		+ '<select id="csv-props">'
	csvProps.forEach(function(cp) {
			html = html + '<option value="' + cp + '">' + cp + '</option>'
	})
	html = html
		+ '</select>'
		+ '<button id="join-btn">OK</button>'
	document.getElementById(divId).innerHTML = html
	callback()	
}

exports.joining = function(divId, callback) {
	var html = '<p><b>Joining...</b></p>'
	document.getElementById(divId).innerHTML = html
	callback()	
}

exports.done = function(divId, callback) {
	var html = '<p><b>Properties have been added</b></p>'
		+ '<button id="save">Save collection</button>'
		+ '<button id="continue">Continue editing</button>'
	document.getElementById(divId).innerHTML = html
	callback()
}

