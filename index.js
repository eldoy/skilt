const http = require('http')
const httpProxy = require('http-proxy')
const extras = require('extras')
const rekvest = require('rekvest')

function wildcardToRegExp (s) {
  return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$')
}

function regExpEscape (s) {
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
  let {
    host = 'localhost',
    target = 'localhost',
    port = 5000
  } = sites[name]

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
  proxy.on('close', function(){})
  proxy.on('error', function(){})
  routes.push({ host, proxy })
}

function getRoute(req) {
  rekvest(req)

  const route = routes.find(r => {
    return r.host.find(h => h.test(req.hostname))
  })
  if (!route) {
    console.log(`Route for ${req.hostname} not found.`)
  }
  return route
}

var proxyServer = http.createServer(function (req, res) {
  const route = getRoute(req)
  route && route.proxy.web(req, res)
})

proxyServer.on('upgrade', function (req, socket, head) {
  const route = getRoute(req)
  route && route.proxy.ws(req, socket, head)
})

const PORT = process.env.SKILT_PORT || 80
console.log('Proxy server listening on port', PORT)
proxyServer.listen(PORT)
