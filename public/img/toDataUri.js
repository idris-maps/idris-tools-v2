var fs = require('fs')
var x = fs.readFileSync('file-icon.png')
var d = {uri: x.toString('base64')}

fs.writeFileSync('file-icon.json', JSON.stringify(d), 'utf-8')
console.log('done')
