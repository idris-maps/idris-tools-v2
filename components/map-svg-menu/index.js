var firstDrop = require('./lib/first-drop')
var close = require('./lib/closed')
var main = require('./lib/main')
var layer = require('./lib/layer')
var parentContent = require('./lib/parent-content-html')
var addLayer = require('./lib/add-layer')
var labelProperty = require('./lib/label-property')
var styleByProperty = require('./lib/style-by-property')
var styleByPropertyManual = require('./lib/style-by-property-manual')
var styleByPropertyNum = require('./lib/style-by-property-num')
var styleByPropertyRule = require('./lib/style-by-property-rule')
var setMapSize = require('./lib/set-map-size')
var setMapBbox = require('./lib/set-map-bbox')
var saveSvg = require('./lib/save-svg')

module.exports = function(divId) {
	var o = this
	o.parentId = divId
	o.parentContent = parentContent
	o.parent = document.getElementById(o.parentId)
	o.parent.innerHTML = o.parentContent
	o.divId = 'menu-body'
	o.div = document.getElementById('menu-body')

	o.close = function() { close(o)	}
	o.init = function(map) { o.map = map; firstDrop(o) }
	o.main = function() { main(o, map) }
	o.layer = function(index) { layer(o, index) }
	o.addLayer = function() { addLayer(o) }
	o.labelProperty = function(index) { labelProperty(o, index) }
	o.styleByProperty = function(index) { styleByProperty(o, index) }
	o.styleByPropertyManual = function(index, sbp) { styleByPropertyManual(o, index, sbp) }
	o.styleByPropertyNum = function(index, sbp) { styleByPropertyNum(o, index, sbp) }
	o.styleByPropertyRule = function(index, sbp) { styleByPropertyRule(o, index, sbp) }
	o.setMapSize = function() { setMapSize(o) }
	o.setMapBbox = function() { setMapBbox(o) }
	o.saveSvg = function() { saveSvg(o) }
}
