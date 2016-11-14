var intersect = require('turf-intersect')

module.exports = function(config) {
	var msg = document.getElementById('progress')
	var bbox = bbToFeat(config.bbox)
	if(config.type === 'crop') { 
		cropLoop(0, config.feats, bbox, [], msg, function(toKeep) { done(config, toKeep) }) 
	} else if(config.type === 'intersect') { 
		intersectLoop(0, config.feats, bbox, [], msg, function(toKeep) { done(config, toKeep) }) 
	} else {
		withinLoop(0, config.feats, bbox, [], msg, function(toKeep) { done(config, toKeep) })
	}
}

function withinLoop(i, feats, bbox, toKeep, msg, callback) {
	if(i === feats.length) { callback(toKeep) }
	else {
		var f = feats[i]
		var int = intersect(f,bbox)
		if(int) {
			var same = isSame(int.geometry, f.geometry)
			if(same) { toKeep.push(f) }
		}
		if(Math.floor(i/10) === i/10) {
			setTimeout(function() {
				msg.innerHTML = i + ' of ' + feats.length
				withinLoop(i+1, feats, bbox, toKeep, msg, callback)
			},1)
		} else {
			withinLoop(i+1, feats, bbox, toKeep, msg, callback)
		}
	}
}

function intersectLoop(i, feats, bbox, toKeep, msg, callback) {
	if(i === feats.length) { callback(toKeep) }
	else {
		var f = feats[i]
		var int = intersect(f,bbox)
		if(int) { toKeep.push(f) }
		if(Math.floor(i/10) === i/10) {
			setTimeout(function() {
				msg.innerHTML = i + ' of ' + feats.length
				intersectLoop(i+1, feats, bbox, toKeep, msg, callback)
			},1)
		} else {
			intersectLoop(i+1, feats, bbox, toKeep, msg, callback)
		}
	}
}

function cropLoop(i, feats, bbox, toKeep, msg, callback) {
	if(i === feats.length) { callback(toKeep) }
	else {
		var f = feats[i]
		var int = intersect(f,bbox)
		if(int) { int.properties = f.properties; toKeep.push(int) }
		if(Math.floor(i/10) === i/10) {
			setTimeout(function() {
				msg.innerHTML = i + ' of ' + feats.length
				cropLoop(i+1, feats, bbox, toKeep, msg, callback)
			},1)
		} else {
			cropLoop(i+1, feats, bbox, toKeep, msg, callback)
		}
	} 
} 

function done(config, feats) {
	config.evt.emit('new-collection', {type: 'FeatureCollection', features: feats})
}

function bbToFeat(bb) {
	return {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [[
				[bb[0], bb[1]],
				[bb[0], bb[3]],
				[bb[2], bb[3]],
				[bb[2], bb[1]],
				[bb[0], bb[1]]
			]]
		}
	}
}

function isSame(c1, c2) {
	var s1 = JSON.stringify(c1)
	var s2 = JSON.stringify(c2)
	return s1 === s2
} 
