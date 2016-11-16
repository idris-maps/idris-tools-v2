module.exports = function(feats, props, callback) {
	var newFeats = []
	feats.forEach(function(f) {
		var newProps = {}
		props.forEach(function(p) { newProps[p] = f.properties[p] })
		f.properties = newProps
		newFeats.push(f)
	})
	callback(newFeats)
}
