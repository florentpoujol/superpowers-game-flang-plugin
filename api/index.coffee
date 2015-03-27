if window? then window.EventEmitter = require("events").EventEmitter

fs = require 'fs'

SupAPI.registerPlugin 'typescript', 'fLang', {
  code: fs.readFileSync(__dirname + '/fLang.ts', encoding: 'utf8')
  defs: fs.readFileSync(__dirname + '/fLang.d.ts', encoding: 'utf8')
}
