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
        en: "Hello",
        fr: "Bonjour",
        es: "Hola"
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

      // Test GET with who parameter
      {
        reqSpec: {
          url: '/hello',
          method: "GET",
          parameters: {
            who: "Addison",
          }
        },
        resSpec: {
          statusCode: 200,
          body: { msg: "Hello Addison!" }
        }
      },

      // Test GET with who parameter in fr locale
      {
        reqSpec: {
          url: '/hello',
          method: "GET",
          parameters: {
            who: "Natalie",
            locale: "fr"
          }
        },
        resSpec: {
          statusCode: 200,
          body: { msg: "Bonjour Natalie!" }
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
            en: "Hello",
            fr: "Bonjour",
            es: "Hola"
          } 
        }
      },

      // Test GET on /greetings/es
      {
        reqSpec: {
          url: '/greetings/es',
          method: "GET",
        },
        resSpec: {
          statusCode: 200,
          body: { greeting: "Hola" }
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
