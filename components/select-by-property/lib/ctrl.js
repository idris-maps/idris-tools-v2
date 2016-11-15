exports.init = function(evt) {
	document.getElementById('btn-prop').onclick = function() {
		evt.emit('property', document.getElementById('select-prop').value)
	}
} 

exports.notNum = function(evt) {
	document.getElementById('get-checked').onclick = function() {
		var vals = getChecked(true)
		evt.emit('values', vals)
	}	
	document.getElementById('get-not-checked').onclick = function() {
		var vals = getChecked(false)
		evt.emit('values', vals)
	}
}

exports.num = function(evt) {
	document.getElementById('by-rule-btn').onclick = function() {
		var operator = document.getElementById('operator').value
		var value = document.getElementById('value').value
		if(value) {
			evt.emit('rule', { operator: operator, value: +value })
		}
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
