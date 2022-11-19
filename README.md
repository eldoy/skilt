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

Add config file in `~/.config/skilt/config.yml`:

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

Add multiple apps like this:

```yml
firmalisten:
  host: firmalisten.test
  port: 5843
pay_eldoy_test:
  host: pay.eldoy.test
  port: 5988
```

### Commands

Start your proxy quietly with:
```
skilt
```

Start quietly in background with:
```
nohup skilt start >/dev/null 2>&1
```

TIP: This can be added as an alias to your `.zshrc`:
```
alias skiltq=nohup skilt >/dev/null 2>&1
```

and then you run in background with `skiltq &`

Stop your proxy with:
```
skilt stop
```

Go to [http://firmalisten.test](http://firmalisten.test) and enjoy!

MIT Licensed. Enjoy!
