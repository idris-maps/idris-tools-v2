module.exports = function(d) {
var str = '<!doctype html>'
+ '<html>'
	+ '<head>'
		+ '<meta charset="utf-8">'
		+ '<meta name="viewport" content="width=device-width, initial-scale=1"/>'
		+ '<meta name="description" content="' + d.name + ' - by Idris GIS online tools"/>'
		+ '<meta name="keywords" content="GIS, online tool, select, ' + d.keywords + ', Idris maps">'  
		+ '<title>' + d.name + '</title>'

if(d.folder === 'by-bbox-draw' || d.folder === 'by-click') {
	str = str + '<link rel="stylesheet" href="' + d.link.leafletCSS + '">'
		+ '<script src="' + d.link.leafletJS + '"></script>'
}

str = str 
  + '<link rel="stylesheet" href="' + d.link.css + '">'
	+ '</head>'
	+ '<body>'
		+ '<div id="header">'
			+ '<a id="back" href="' + d.link.back + '">'
				+ '<img src="../../img/logo_fond_fonce.png" alt="Idris maps"/>'
			+ '</a>'
		+ '</div>'
		+ '<h1 id="title">' + d.name + '</h1>'
		+ '<div id="selecter"></div>'
		+ '<script src="script.min.js"></script>'
	+ '</body>'
+ '</html>'

return str
}
