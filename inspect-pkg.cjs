const fs = require('fs')
const c = fs.readFileSync('package.json', 'utf8')
console.log('len=', c.length)
console.log(c)
