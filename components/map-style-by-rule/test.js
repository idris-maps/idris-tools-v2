var feats = require('./cantons_1%.json').features
var Rule = require('./index')

var rule = new Rule({
	property: 'canton_id',
	type: 'fill',
	features: feats
})

rule.addRule({
	operator: '>=',
	propValue: 13,
	styleValue: 'red'
})

rule.addRule({
	operator: '>=',
	propValue: 18,
	styleValue: 'blue'
})

console.log(rule.output())


