#!/usr/bin/env node

const extras = require('extras')

const command = process.argv[2]

function usage() {
  console.log('Usage:\n')
  console.log('  skilt start - start web proxy')
  console.log('  skilt stop  - stop web proxy')
  process.exit(0)
}

if (!command) usage()

if (command == 'start') {
  require('../index.js')
} else if (command == 'stop') {
  extras.run(`kill -9 $(pgrep -f bin/skilt)`)
} else {
  console.log('Unknown command:', command)
  usage()
}
