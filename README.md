# express-runner

[![Build Status](http://circleci-badges-max.herokuapp.com/img/asalonen/express-runner?token=f559b2ca9774d178275dc178d5012fc3e1333a77)](https://circleci.com/gh/asalonen/express-runner)

Convenience lib for exposing code as express app

## Example with docker

nodeapp/app.js:

```
module.exports = {
    hello: function (opts, callback) {
        callback(undefined, "hello: "+opts.name);
    }
```

docker-compose.yml:

```
  hello-service:
    image: express-runner
    volumes:
      - ./nodeapp:/data/app
    command: node /data/express-runner /data/app/app.js
    ports:
      - 80:80
```

GET /hello?name=world --> "hello: world"

