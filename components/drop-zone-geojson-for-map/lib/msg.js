exports.write = function(m) {
	var p = document.getElementById('msg')
	p.innerHTML = m
}

exports.add = function(m) {
	var p = document.getElementById('msg')
	var c = p.innerHTML
	p.innerHTML = c + '<br/>' + m
}
