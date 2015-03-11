fs = require 'fs'

SupAPI.addPlugin 'typescript', 'fLang', {
  code: fs.readFileSync(__dirname + '/fLang.ts', encoding: 'utf8');
  defs: fs.readFileSync(__dirname + '/fLang.d.ts', encoding: 'utf8')
}
