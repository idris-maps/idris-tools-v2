module.exports = function(menu) {
	view(menu, function(bbox) {
		ctrl(menu, bbox)
	})
}

function view(menu, callback) {
	var bbox = menu.map.bbox
	var html = '<h2>Set bounding box</h2>'
		+ '<p><b>Min. long.</b></p>'
		+ '<input id="map-bbox-minlong" value="' + bbox[0] + '" type="number" />'
		+ '<p><b>Min. lat.</b></p>'
		+ '<input id="map-bbox-minlat" value="' + bbox[1] + '" type="number" />'
		+ '<p><b>Max. long.</b></p>'
		+ '<input id="map-bbox-maxlong" value="' + bbox[2] + '" type="number" />'
		+ '<p><b>Max. lat.</b></p>'
		+ '<input id="map-bbox-maxlat" value="' + bbox[3] + '" type="number" />'
		+ '<button id="map-bbox-btn">OK</button>'
	menu.div.innerHTML = html
	callback(bbox)
}

function ctrl(menu, prevBbox) {
	document.getElementById('map-bbox-btn').onclick = function() {
		var x0 = document.getElementById('map-bbox-minlong').value
		var x1 = document.getElementById('map-bbox-minlat').value
		var x2 = document.getElementById('map-bbox-maxlong').value
		var x3 = document.getElementById('map-bbox-maxlat').value
		if(!isNaN(x0) && !isNaN(x1) && !isNaN(x2) && !isNaN(x3)) {
			if(+x0 !== prevBbox[0] || +x1 !== prevBbox[1] || +x2 !== prevBbox[2] || +x3 !== prevBbox[3]) {
				menu.map.changeBbox([+x0, +x1, +x2, +x3])
				menu.close()
			} else {
				menu.close()
			}
		}
	}
}
