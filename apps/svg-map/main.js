var Map = require('../../components/map-svg')
var Menu = require('../../components/map-svg-menu')

var map = new Map([0,0,1,1], {width: window.innerWidth, height: window.innerHeight - 200})
var menu = new Menu('menu')

window.onload = function() {
	init()
}

function init() {

	menu.init(map)
}
