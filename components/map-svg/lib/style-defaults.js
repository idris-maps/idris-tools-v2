exports.polygon = function() {
	return {
		fill: '#a6cee3',
		'fill-opacity': 0.5,
		stroke: '#1f78b4',
		'stroke-width': 1,
		'stroke-opacity': 1
	}
}

exports.line = function() {
	return {
		fill: 'none',
		stroke: '#33a02c',
		'stroke-width': 1,
		'stroke-opacity': 1
	}
}

exports.point = function() {
	return {
		r: 5,
		fill: '#fb9a99',
		'fill-opacity': 0.5,
		stroke: '#e31a1c',
		'stroke-width': 1,
		'stroke-opacity': 1
	}
}

exports.label = function() {
	return {
		fill: 'black',
		'font-family': 'arial, helvetica, sans-serif',
		'font-size': 10,
		'text-anchor': 'middle'
	}
}
