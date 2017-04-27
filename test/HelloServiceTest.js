var carbon = require('carbon-io')
var __     = carbon.fibers.__(module)
var _o     = carbon.bond._o(module)
var o      = carbon.atom.o(module).main // Note the .main here since this is the main (test) application

/***************************************************************************************************
 * HelloServiceTest
 */
__(function() {
  module.exports = o({

    /***************************************************************************
     * _type
     */
    _type: carbon.carbond.test.ServiceTest,

    /***************************************************************************
     * name
     */
    name: "HelloServiceTest",

    /***************************************************************************
     * service
     */
    service: _o('../lib/HelloService'),

    /***************************************************************************
     * setup
     */
    setup: function() {
      carbon.carbond.test.ServiceTest.prototype.setup.call(this)

      // Greetings in multiple locales
      var greetings = {
        _id: "greetings",
        en: "Hello world!",
        fr: "Bonjour le monde!",
        es: "Hola mundo!"
      }
      this.service.db.command({dropDatabase: 1})
      this.service.db.getCollection("hello-config").insert(greetings)
    },

    /***************************************************************************
     * tests
     */
    tests: [
      // Test GET
      {
        reqSpec: {
          url: '/hello',
          method: "GET"
        },
        resSpec: {
          statusCode: 200,
          body: { msg: "Hello world!" }
        }
      },

      // Test GET with locale parameter
      {
        reqSpec: {
          url: '/hello',
          method: "GET",
          parameters: {
            locale: "es",
          }
        },
        resSpec: {
          statusCode: 200,
          body: { msg: "Hola mundo!" }
        }
      },

      // Test GET on /greetings
      {
        reqSpec: {
          url: '/greetings',
          method: "GET",
        },
        resSpec: {
          statusCode: 200,
          body: {
            en: "Hello world!",
            fr: "Bonjour le monde!",
            es: "Hola mundo!"
          } 
        }
      },

      // Test GET on /greetings/es
      {
        reqSpec: {
          url: '/greetings/fr',
          method: "GET",
        },
        resSpec: {
          statusCode: 200,
          body: { greeting: "Bonjour le monde!" }
        }
      },

      // Test GET on /greetings/foo which should not exist
      {
        reqSpec: {
          url: '/greetings/foo',
          method: "GET",
        },
        resSpec: {
          statusCode: 404
        }
      }
    ]

  })
})
