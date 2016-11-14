var html = require('./html')

exports.choose = function(config) {
	document.getElementById('within-bbox').onclick = function() {
		config.type = 'within'
		config.evt.emit('type-chosen')
	}

	document.getElementById('crop-bbox').onclick = function() {
		config.type = 'crop'
		config.evt.emit('type-chosen')
	}

	document.getElementById('intersect-bbox').onclick = function() {
		config.type = 'intersect'
		config.evt.emit('type-chosen')
	}
}

exports.bbox = function(config) {
	document.getElementById('bbox-btn').onclick = function() {
		var minLon = document.getElementById('min-lon').value
		var minLat = document.getElementById('min-lat').value
		var maxLon = document.getElementById('max-lon').value
		var maxLat = document.getElementById('max-lat').value

			if(!isNaN(minLon) && !isNaN(minLat) && !isNaN(maxLon) && !isNaN(maxLat)) {
console.log(minLon, minLat, maxLon, maxLat)
				var bb = {}
				var err = []
				if(+minLon < +maxLon) { bb.xMin = +minLon; bb.xMax = +maxLon } else { 
					err.push('Min. longitude is greater than max. longitude') 
				}
				if(+minLat < +maxLat) { bb.yMin = +minLat; bb.yMax = +maxLat } else {
					err.push('Min. latitude is greater than max. latitude') 			
				}
				if(+minLat === +maxLat) { err.push('Min. latitude and max. latitude can not be the same') }
				if(+minLon === +maxLon) { err.push('Min. latitude and max. latitude can not be the same') }

console.log(bb, err)
				if(err.length === 0) {
					config.bbox = [bb.xMin, bb.yMin, bb.xMax, bb.yMax]
					config.evt.emit('bbox-chosen')
				} else {
					var html = '<b>Errors</b><br/>'
					err.forEach(function(e) { html = html + '* ' + e + '<br/>' })
					document.getElementById('err').innerHTML = html
				}
			}
	}
}

function errMsg(msg) {
	var el = document.getElementById('err')
	el.style.display = 'block'
	el.innerHTML = msg
}
