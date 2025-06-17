#!/usr/bin/env node

const extras = require('extras')

const command = process.argv[2]
const args = process.argv.slice(3)

function usage() {
  console.log('Usage:\n')
  console.log('  skilt start [--https | -h] - start web proxy')
  console.log('  skilt stop  - stop web proxy')
  process.exit(0)
}

if (!command) usage()

if (command == 'start') {
  const useHttps = args.includes('--https') || args.includes('-h')
  process.env.SKILT_HTTPS = useHttps ? 'true' : 'false'
  require('../index.js')
} else if (command == 'stop') {
  extras.run(`kill -9 $(pgrep -f bin/skilt)`)
} else {
  console.log(`\nUnknown command: ${command}\n`)
  usage()
}
