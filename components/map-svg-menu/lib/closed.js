var dom = require('../../utils/dom')
/*
module.exports = function(menu) {
	var close = document.getElementById('close-menu-div')
	close.style.display = 'none'
	menu.div.innerHTML = '<button id="open-menu">Menu</button>'
	document.getElementById('open-menu').onclick = function() {
		close.style.display = 'block'
		menu.main()
	}
}
*/
module.exports = function(menu) {
	var closeMenu = document.getElementById('close-menu-div')
	dom.addClass(document.getElementById('menu'), 'closed')
	menu.div.innerHTML = ''
	closeMenu.innerHTML = '<img id="open-menu" alt="Menu" src="../img/menu-icon.png"/>'
	document.getElementById('open-menu').onclick = function() {
		dom.removeClass(document.getElementById('menu'), 'closed')
		closeMenu.innerHTML = '<img id="close-menu" alt="Close menu" src="../img/close-icon.png"/>'
		document.getElementById('close-menu').onclick = function() { menu.close() }
		menu.main()
	}
}

