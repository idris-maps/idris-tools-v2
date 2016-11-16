module.exports = function(layer) {
	var feats = []
	for(k in layer._layers) {
		if(layer._layers[k].options.color === '#E79D92') {
			feats.push(layer._layers[k].feature)
		} 
	}
	return feats
}
