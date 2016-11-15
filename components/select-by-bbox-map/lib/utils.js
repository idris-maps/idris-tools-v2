exports.toFeat = function(p1, p2) { return toFeat(p1, p2) }
exports.toBbox = function(p1, p2) { return toBbox(p1, p2) }

function toFeat(start, end) {
	var c = getXY(start, end)
	return {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [[
				[c.x0, c.y0],
				[c.x0, c.y1],
				[c.x1, c.y1],
				[c.x1, c.y0],
				[c.x0, c.y0]
			]]
		}
	}
}

function toBbox(start, end) {
	var c = getXY(start, end)
	return [c.x0, c.y0, c.x1, c.y1]
}

function getXY(start, end) {
	if(start.lng < end.lng) { var x0 = start.lng; var x1 = end.lng }
	else { var x1 = start.lng; var x0 = end.lng }
	if(start.lat < end.lat) { var y0 = start.lat; var y1 = end.lat }
	else { var y1 = start.lat; var y0 = end.lat }
	return { x0: x0, x1: x1, y0: y0, y1: y1 }
}
