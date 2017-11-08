# Hello Service (mongodb)

[![Build Status](https://img.shields.io/travis/carbon-io-examples/example__hello-world-service-mongodb/master.svg?style=flat-square)](https://travis-ci.org/carbon-io-examples/example__hello-world-service-mongodb) ![Carbon Version](https://img.shields.io/badge/carbon--io-0.7-blue.svg?style=flat-square)



This example builds on our other hello world examples:

* [Our simple hello-world example](https://github.com/carbon-io-examples/example__hello-world-service)
* [Our parameter parsing hello-world example](https://github.com/carbon-io-examples/example__hello-world-service-parameter-parsing)

This example illustrates:
* how to build services with multiple endpoints using multiple modules / source files
* how to interact with MongoDB 
* the use of exceptions for communicating HTTP errors to the client
* the use of sub-endpoints and path parameters
* the use of environment variables

The code defining the top level service is located in ```lib/HelloService.js```. This service has two 
endpoints, each of which is defined in its own module. 

## The top-level service

There are a few things of note here:

1. We define and use two environment variables in this service: ```MONGODB_URI``` and ```LOCALE```. 
2. This service is composed of many endpoints, each of which are defined elsewhere. This is how larger projects are maintained. 

```javascript
__(function() {
  module.exports = o({
    _type: carbon.carbond.Service,
    description: "Advanced hello-world service using MongoDB.",
    environmentVariables: {
      MONGODB_URI: {
        help: "MongoDB connection string URI",
        required: false
      },
      LOCALE: {
        help: "Default locale for this service",
        required: false
      }
    },
    port: 8888,
    dbUri: _o('env:MONGODB_URI') || "mongodb://localhost:27017/hello-world",
    defaultLocale: _o('env:LOCALE') || "en",
    endpoints : {
      hello: _o('./HelloEndpoint'),
      greetings: _o('./GreetingsEndpoint')
    }
  })
})

```

## HelloEndpoint

```javascript
__(function() {
  module.exports = o({
    _type: carbon.carbond.Endpoint,
    get: {
      parameters: { 
        locale: {
          location: 'query',
          required: false,
          default: 'en',
          schema: { type: 'string' }
        }
      },
      
      responses: [
        {
          statusCode: 200,
          description: "Success",
          schema: {
            type: 'object',
            properties: {
              msg: { type: 'string' }
            },
            required: [ 'msg' ],
            additionalProperties: false
          }
        }
      ],
      
      service: function(req) {
        var greeting = "Hello world!" // default
        
        // Find the config in the database that maps locales to greetings
        var greetings = this.getService().db.getCollection("hello-config").findOne({_id: 'greetings'})
        if (greetings) {
          locale = req.parameters.locale || this.getService().defaultLocale
          greeting = greetings[req.parameters.locale] || greeting
        }
        
        return { msg: greeting }
      }
    }
  })
})

```

## GreetingsEndpoint

```javascript
__(function() {
  module.exports = o({
    _type: carbon.carbond.Endpoint,
    get: {
      responses: [
        {
          statusCode: 200,
          description: "Success",
          schema: {
            type: 'object',
            additionalProperties: true
          }
        }
      ],
      
      service: function(req) {
        var result = this.getService().db.getCollection("hello-config").findOne({_id: 'greetings'})
        delete result['_id']
        return result
      }
    },

    endpoints: {
      ":locale": o({
        _type: carbon.carbond.Endpoint,
        get: {
          parameters: {
            locale: {
              location: 'path',
              required: 'true',
              schema: { type: 'string' }
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Success",
              schema: {
                type: 'object',
                properties: {
                  greeting: { type: 'string' }
                },
                required: [ 'greeting' ],
                additionalProperties: false
              }
            }
          ],
          
          service: function(req) {
            var greetings = this.getService().db.getCollection("hello-config").findOne({_id: 'greetings'})
            if (!greetings) {
              throw new carbon.HttpErrors.InternalServerError("Database misconfiguration")
            }

            var locale = req.parameters.locale
            var greeting = greetings[locale]
            if (!greeting) {
              throw new carbon.HttpErrors.NotFound(`Cannot find greeting for locale ${locale}`)
            }
            return { greeting: greeting }
          }
        }
      })
    }                  
  })
})
```

## Installing the service

We encourage you to clone the git repository so you can play around
with the code. 

```
$ git clone -b carbon-0.7 git@github.com:carbon-io-examples/example__hello-world-service-mongodb.git
$ cd example__hello-world-service-mongodb
$ npm install
```

## Setting up your environment

This example expects a running MongoDB database. The code will honor a ```MONGODB_URI``` environment variable. The default URI is
```mongodb://localhost:27017/contacts```.

To set the environment variable to point the app at a database different from the default (on Mac):
```
$ export MONGODB_URI=mongodb://localhost:27017/mydb
```

## Running the service

To run the service:

```sh
$ node lib/HelloService
```

For cmdline help:

```sh
$ node lib/HelloService -h
```

## Accessing the service

To access the ```/hello``` endpoint:

```
$ curl localhost:8888/hello 
{ msg: "Hello world!" }

$ curl 'localhost:8888/hello?locale=es'
{ msg: "Hola mundo!" }
```
To access the ```/greetings``` endpoint:

```
$ curl localhost:8888/greetings 
{"en":"Hello world!","fr":"Bonjour le monde!","es":"Hola mundo!"}
```


## Running the unit tests

This example comes with a simple unit test written in Carbon.io's test framework called TestTube. It is located in the ```test``` directory. 

```
$ node test/HelloServiceTest
```

or 

```
$ npm test
```

## Generating API documentation (aglio flavor)

To generate documentation using aglio, install it as a devDependency:

```
$ npm install -D --no-optional aglio
```

Using `--no-optional` speeds up aglio's install time significantly. Then generate the docs using this command:

```sh
$ node lib/HelloService gen-static-docs --flavor aglio --out docs/index.html
```

* [View current documentation](
http://htmlpreview.github.io/?https://raw.githubusercontent.com/carbon-io-examples/example__hello-world-service-mongodb/blob/carbon-0.7/docs/index.html)
