module.exports = function(data, callback) {
	var f = featureDefault()
	var c = []
	var ele = 0
	var climb = 0
	var start = null
	var end = null
	data.forEach(function(d,i) {
		if(i === 0 && d.time) { start = d.time }
		if(i === data.length-1 && d.time) { end = d.time }		
		if(i === 0 && d.ele) { ele = d.ele }
		if(i !== 0 && d.ele) {
			if(d.ele > ele) { climb = climb + Math.floor(d.ele - ele); ele = d.ele }
		}
		c.push([d.lon, d.lat])
	})
	if(climb !== 0) { f.properties.climb = climb }
	if(start && end) { f.properties.time = elapsed(start, end) }
	f.geometry = {
		type: 'LineString',
		coordinates: c
	}
	callback({type: 'FeatureCollection', features: [f]})
}

function featureDefault() {
	return {
			type: 'Feature',
			properties: {},
			geometry: {}
	}
}

function elapsed(start, end) {
/*
http://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html#fbid=Ygj1xcdnTCD
*/
 var date1_ms = start
 var date2_ms = end
 var difference_ms = date2_ms - date1_ms
 difference_ms = difference_ms/1000
 var seconds = Math.floor(difference_ms % 60)
 difference_ms = difference_ms/60
 var minutes = Math.floor(difference_ms % 60)
 difference_ms = difference_ms/60
 var hours = Math.floor(difference_ms % 24)
 var days = Math.floor(difference_ms/24)
 
	if(days !== 0) { var str = days + ' d '} else { var str = '' }
 return str + dec(hours) + 'h ' + dec(minutes) + 'm ' + dec(seconds) + 's'
}

function dec(n) {
	if(n<10) { return '0' + n }
	else { return n }
}

