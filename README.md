# Skilt

Web proxy server.

Lets you use your own domain names for apps in development running on localhost.

### Install

This example will set up `http://firmalisten.test` to point to an app running on `locahost` port `5834`.

First install the command line tool:
```
npm i -g skilt
```

### Config

Add config file in `~/.config/skilt/sites.yml`:

```yml
firmalisten:
  host: firmalisten.test
  port: 5843
```

Add multiple domains like this:

```yml
firmalisten:
  host: firmalisten.test www.firmalisten.test
  port: 5843
```

Wildcard domains work like this:

```yml
firmalisten:
  host: *.firmalisten.test
  port: 5843
```

Add multiple apps like this:

```yml
firmalisten:
  host: firmalisten.test
  port: 5843
pay_eldoy_test:
  host: pay.eldoy.test
  port: 5988
```

### Local Setup

Add an entry for your domain in the `/etc/hosts` file to route `firmalisten.test` to localhost:
```
127.0.0.1 firmalisten.test
```

### Wildcard domains

Instead of using the `/etc/hosts` file, use `dnsmasq` to forward browser requests to localhost:

```
brew install dnsmasq
```

Add this to `$(brew --prefix)/etc/dnsmasq.conf`:

```
address=/firmalisten.test/127.0.0.1
```

Start dnsmasq as a service:

```
sudo brew services start dnsmasq
```

Add a file in `/etc/resolver/firmalisten.test`:

```
nameserver 127.0.0.1
```

Test that it's working with:

```
ping sub.firmalisten.test
```

Article about this setup is [found here.](https://yuchen52.medium.com/dns-configurations-for-dev-environment-d35dbd3eba5d)

### Port

By default the skilt server runs on port 80. To change port start skilt using the `SKILT_PORT` env variable:
```
SKILT_PORT=8080 skilt start
```

To be able to use the HTTPS server, the local certificates has to be created and stored on the config/skilt dir first.

```
cd ~/.config/skilt
openssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.cert -days 365 -nodes -subj "/CN=localhost"
```

Once the localhost.key and the localhost.cert files are created, the HTTPS server can be started like this:

```
skilt start --https
```

or like this

```
skilt start -h
```

### Commands

Start your proxy server with:
```
skilt start
```

Start quietly in background with:
```
nohup skilt start >/dev/null 2>&1
```

TIP: This can be added as an alias to your `.zshrc`:
```
alias skiltq="nohup skilt start >/dev/null 2>&1"
```

and then you run in background with `skiltq &`

Stop your proxy with:
```
skilt stop
```

Go to [http://firmalisten.test](http://firmalisten.test) and enjoy!

MIT Licensed. Enjoy!
