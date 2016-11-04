var parseWKT = require('wellknown')

module.exports = function(divId, data, evt) {
	var o = this
	o.divId = divId
	o.data = data
	o.evt = evt
	o.head = null
	o.lines = []
	o.nbCols = o.data[0].length
	o.hasHead = function() {
		o.head = o.data[0]
		o.data.forEach(function(d,i) {
			if(i !== 0) {
				var f = {}
				d.forEach(function(cell, cellIndex) {
					if(isNaN(cell)) { var cellData = cell } else { var cellData = +cell }
					f[o.head[cellIndex]] = cellData
				})
				o.lines.push(f)
			}
		})		
	}
	o.setHead = function(head) {
		o.head = head
		o.data.forEach(function(d,i) {
			var f = {}
			d.forEach(function(cell, cellIndex) {
				if(isNaN(cell)) { var cellData = cell } else { var cellData = +cell }
				f[o.head[cellIndex]] = cellData
			})
			o.lines.push(f)
		})	
	}
	o.setLL = function(lngCol, latCol, callback) {
		o.lines.forEach(function(f) {
			f.geometry = {
				type: 'Point',
				coordinates: [f[o.head[lngCol]], f[o.head[latCol]]]
			}
		})
		callback()
	}
	o.setWKT = function(wktCol, callback) {
		console.log('conf.setWKT', wktCol)
		o.lines.forEach(function(f) {
			if(f[o.head[wktCol]]) {
				f.geometry = parseWKT(f[o.head[wktCol]])
			}
		})
		callback()
	}
	o.geojson = function(callback) {
		var c = {type: 'FeatureCollection', features: []}
		o.lines.forEach(function(l) {
			if(l.geometry) {
				var f = {type: 'Feature' , properties: {}}
				for(k in l) {
					if(k === 'geometry') { f.geometry = l[k] }
					else {
						f.properties[k] = l[k]
					}
				}
				c.features.push(f)
			}
		})
		callback(c)
	}
	return this
}
