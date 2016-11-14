var icon = 'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAYAAAC9pNwMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADtQAAA7UBCn5qWwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEnSURBVEiJ7ZUxSgNREEDfhBQBMQhWKVKJIKRQS9N5ghRewNoj2FjlACGQG6QWC/EGokjQwkLSh1ib3rFwId/N7s7ssrhFdmCK/Tv/vQ+fmY+q4kngBFAjL728BhVFLa7Ftbi0kGg4bP4QOQDGrA+3C/QN3juwCL5HqvqQWGlMqxvsaZWW90AjlW2IBbgrIJ0De5lsx4xuAx85pCugZ3KdD8QR8OUUX7iYOV6nAfBtSIdunrcwkl9nSG+JuqR0cSSfJkhfgZ1cnALiFvAcSD+Bbl6OAG+x1r5S1ceNhg9CRDrAC7APnKvqk1HfBybhWhM4jtW1syAAqroUkQFwaEkD5h9P07EpTT4DZkX3b9/rVJk46Y7PRKRVsuc0viD89uK/x/bdcWXiH2BFcZ2Yon4xAAAAAElFTkSuQmCC'

var save = require('../../utils/save')

module.exports = function(obj) {
	var btn = L.Control.extend({
		options: {
		  position: 'topright'
		},
		onAdd: function(map) {
		  var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
		  container.style.backgroundColor = 'white'    
		  container.style.width = '30px'
		  container.style.height = '30px'
			container.style.padding = '5px'
			container.innerHTML = '<img id="download-btn" src="data:image/png;base64,' + icon + '" style="width:100%"/>'
		  container.onclick = function(){
		    save.json('geo.json', obj.toGeoJSON())
		  }
		  return container;
		}
	})
	var o = this
	o.shown = false
	o.map = obj.map
	o.show = function() {
		if(!o.shown) {
			o.map.addControl(new btn())
			o.shown = true
		}
	}
}
