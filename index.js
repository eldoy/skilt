const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const extras = require('extras')
const rekvest = require('rekvest')

function wildcardToRegExp(s) {
  return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$')
}

function regExpEscape(s) {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

console.log('Reading config file...')
const configPath = '~/.config/skilt/sites.yml'

if (!extras.exist(configPath)) {
  console.log('\nConfig file missing!\n')
  console.log('Please add a config file in:')
  console.log(configPath)
  console.log()
  process.exit(0)
}

const sites = extras.read(configPath)

console.log(JSON.stringify(sites, null, 2))

const routes = []
for (const name in sites) {
  let { host = 'localhost', target = 'localhost', port = 5000 } = sites[name]

  if (typeof host == 'string') {
    host = host.split(' ')
  }

  host = host.map(wildcardToRegExp)

  const proxy = new httpProxy.createProxyServer({
    target: {
      host: target,
      port
    }
  })
  proxy.on('close', function () {})
  proxy.on('error', function () {})
  routes.push({ host, proxy })
}

function getRoute(req) {
  try {
    rekvest(req)
  } catch (e) {
    return null
  }

  const route = routes.find((r) => {
    return r.host.find((h) => h.test(req.hostname))
  })
  if (!route) {
    console.log(`Route for ${req.hostname} not found.`)
  }
  return route
}

const USE_HTTPS = process.env.SKILT_HTTPS === 'true'
console.log('Configuration HTTPS:', USE_HTTPS ? 'ENABLED' : 'DISABLED')

var proxyServer

if(USE_HTTPS) {
  const skiltDir = '~/.config/skilt'
  const keyPath = `${skiltDir}/localhost.key`
  const certPath = `${skiltDir}/localhost.cert`

  if (!extras.exist(keyPath)) {
    console.error(`\nSSL key file not found at: ${keyPath}`)
    console.error(`\nPlease generate certificates on ${skiltDir} with:`)
    console.error('\nopenssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.cert -days 365 -nodes -subj "/CN=localhost"\n')
    process.exit(1)
  }
  
  if (!extras.exist(certPath)) {
    console.error(`\nSSL cert file not found at: ${certPath}`)
    process.exit(1)
  }

  const options = {
    key: extras.read(keyPath),
    cert: extras.read(certPath),
  }

  proxyServer = https.createServer(options, function (req, res) {
    const route = getRoute(req)
    route && route.proxy.web(req, res)
  })
} else {
  proxyServer = http.createServer(function (req, res) {
    const route = getRoute(req)
    route && route.proxy.web(req, res)
  })
}

proxyServer.on('upgrade', function (req, socket, head) {
  const route = getRoute(req)
  route && route.proxy.ws(req, socket, head)
})

const DEFAULT_PORT = USE_HTTPS ? 443 : 80
const PORT = process.env.SKILT_PORT || DEFAULT_PORT

console.log('Proxy server listening on port', PORT)
proxyServer.listen(PORT)
