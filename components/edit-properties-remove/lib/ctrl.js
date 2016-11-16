exports.init = function(evt) {
	document.getElementById('rm-selected').onclick = function() {
		var vals = getChecked(false)
		evt.emit('props-to-keep', vals)
	}	
	document.getElementById('rm-unselected').onclick = function() {
		var vals = getChecked(true)
		evt.emit('props-to-keep', vals)
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


function getChecked(bool) {
	var cbs = document.getElementsByClassName('checkbox-input')
	var checked = []
	var notChecked = []
	for(i=0;i<cbs.length;i++) {
		if(cbs[i].checked) { checked.push(cbs[i].id) } else { notChecked.push(cbs[i].id) }
	}
	if(bool) { return checked }
	else { return notChecked }
}
