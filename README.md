# Skilt

Web proxy server.

Lets you use your own domain names for apps in development running on localhost.

### Usage

This example will set up `http://firmalisten.test` to point to an app running on `locahost` port `5834`.

First install the command line tool:
```
npm i -g skilt
```

Add config file in `~/.config/skilt/config.yml`:

```yml
firmalisten:
  hostname: firmalisten.test
  port": 5843
```

Start your proxy with:
```
skilt start
```

Stop your proxy with:
```
skilt stop
```

Go to [http://firmalisten.test](http://firmalisten.test) and enjoy!

MIT Licensed. Enjoy!
