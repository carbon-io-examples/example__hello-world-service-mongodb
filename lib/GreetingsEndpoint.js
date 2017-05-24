var carbon = require('carbon-io')
var __     = carbon.fibers.__(module)
var _o     = carbon.bond._o(module)
var o      = carbon.atom.o(module).main // Note the .main here since this is the main application 

/***************************************************************************************************
 * GreetingsEndpoint
 *
 */
__(function() {
  module.exports = o({

    /***************************************************************************
     * _type
     */
    _type: carbon.carbond.Endpoint,

    /***************************************************************************
     * get
     */
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

    /***************************************************************************
     * endpoints
     */
    endpoints: {
      ":locale": o({ // This defines /greetings/:locale
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
