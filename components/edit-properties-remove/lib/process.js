module.exports = function(feats, props) {
	var newFeats = []
	feats.forEach(function(f) {
		var newProps = {}
		props.forEach(function(p) { newProps[p] = f.properties[p] })
		f.properties = newProps
		newFeats.push(f)
	})
	return newFeats
}
