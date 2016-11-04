var math = require('../../utils/math')
var Rule = require('../../map-style-by-rule')

module.exports = function(menu, index, sbp) {
	var rule = new Rule({type: sbp.type, property: sbp.property, features: menu.map.layers[index].feats})
	view(menu, index, rule, function() {
		ctrl(menu, index, rule)
	})
}

function view(menu, index, rule, callback) {
	var html = '<h2>Style by rule</h2>'
		+ '<p>property: <b>' + rule.property + '</b><br/>'
		+ 'style: <b>' + rule.type + '</b></p>'
		// + metaView(menu, index, rule)
		+ '<div id="sbp-rules">' + ruleTableView(rule) + '</div>'
		+ saveButtonView(rule)
		+ '<div id="sbp-rules-form">' + ruleFormView(menu, index, rule) + '</div>'
		+ '</div>'
console.log(html)
	menu.div.innerHTML = html
	callback()
}

function ctrl(menu, index, rule) {
	document.getElementById('add-sbp-rule').onclick = function() { 
		if(document.getElementById('rule-value-input').value && document.getElementById('rule-style-input').value) {
			rule.addRule({
				propValue: +document.getElementById('rule-value-input').value,
				styleValue: document.getElementById('rule-style-input').value,
				operator: document.getElementById('rule-operator-input').value
			})
			view(menu, index, rule, function() {
				ctrl(menu, index, rule)
			})
		}
	}
	if(rule.rules.length !== 0) {
		document.getElementById('save-sbp-rules').onclick = function() {
console.log(index, rule.output())
			menu.map.addStyleByFeature(index, rule.output())
			menu.close()
		}
	}
}

function ruleFormView(menu, index, rule) {
	var html = '<p><b>Add a rule</b></p>'
		+ '<p>Operator</p>'
		+ '<select id="rule-operator-input">'
	rule.operators.forEach(function(op) {
		html = html + '<option value="' + op.symbol + '">' + op.name + '</option>'
	})
	html = html + '</select>'
		+ '<p>Value</p>'
		+ '<input id="rule-value-input" placeholder="' + rule.property + ' value" type="number" />'
		+ '<p>Style</p>'
		+ '<input id="rule-style-input" placeholder="' + rule.type + ' value" />'
		+ '<button id="add-sbp-rule">Add a rule</button>'
	return html
}

function ruleTableView(rule) {
	if(rule.rules.length !== 0) {
		var html = '<p><b>Rules</b></p><table>'
			+ '<tr class="table-head">'
				+ '<td>Operator</td><td>Value</td><td>Style</td>'
		rule.rules.forEach(function(r) {
			html = html + '<tr>'
				+ '<td>' + r.operator + '</td>'
				+ '<td>' + r.propValue + '</td>'
				+ '<td>' + r.styleValue + '</td>'
		})
		html = html	+ '</tr>'
		+ '</table>'
		return html	
	} else { return '' }
}

function saveButtonView(rule) {
	if(rule.rules.length !== 0) {
		return '<button id="save-sbp-rules">Apply rules</button>'
	} else { return '' }
}

/*
function metaView(menu, index, rule) {
	var meta = getMeta(menu, index, rule)
	var html =  '<p>'
			+ '<b>About the values</b></p>'
			+ '<p><b>lowest</b>: ' + meta.min + ' | '
			+ '<b>highest</b>: ' + meta.max + '<br/>' 
			+ '<b>mean</b>: ' + meta.mean + ' | ' 
			+ '<b>median</b>: ' + meta.median + '<br/>' 
		+ '</p>'
	return html
}

function getMeta(menu, index, sbp) {
	var vals = menu.map.layers[index].getPropertyValues(sbp.property)
	var obj = math.minMax(vals)
	obj.median = math.median(vals)
	obj.mean = math.mean(vals)
	obj.allValues = vals
	return obj
}
*/
