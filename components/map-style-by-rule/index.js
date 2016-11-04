var interpret = require('./lib/interpret')
module.exports = function(obj) {
	var o = this
	init(o, obj)
	o.rules = []
	o.data = []
	o.output = function() {
		return {
			type: o.type,
			property: o.property,
			data: o.data 
		}
	}
	o.operators = [
		{ symbol: '=', name: 'equal to' },
		{ symbol: '>', name: 'greater than' },
		{ symbol: '>=', name: 'equal or greater than' },
		{ symbol: '<', name: 'less than' },
		{ symbol: '<=', name: 'equal or less than' }
	]
	o.addRule = function(obj) {
		var ok = interpretRule(o, obj)
		if(ok) { o.rules.push(obj) }

	}
	o.deleteRule = function(index) {
		o.rules.slice(index, 1)
		o.reinterpret()
	}
	o.reinterpret = function() {
		o.data = []
		o.rules.forEach(function(rule) {
			interpretRule(o, rule)
		})
	}
}

function init(o, obj) {
	if(obj.property) { o.property = obj.property } else { console.log('new Rule(x) error: x needs a "property" key') }
	if(obj.type) { o.type = obj.type } else { console.log('new Rule(x) error: x needs a "type" key') }
	if(obj.features) { o.feats = obj.features } else { console.log('new Rule(x) error: x needs a "features" key') }
}

function interpretRule(o, obj) {
	var ok = false
	if(obj.operator === '=') { interpret.equal(o, obj); ok = true }
	else if(obj.operator === '>') { interpret.greater(o, obj); ok = true }
	else if(obj.operator === '>=') { interpret.greaterOrEqual(o, obj); ok = true }
	else if(obj.operator === '<') { interpret.less(o, obj); ok = true }
	else if(obj.operator === '<=') { interpret.lessOrEqual(o, obj); ok = true }
	return ok
}


