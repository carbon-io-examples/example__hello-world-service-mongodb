var carbon = require('carbon-io')
var __     = carbon.fibers.__(module)
var _o     = carbon.bond._o(module)
var o      = carbon.atom.o(module).main // Note the .main here since this is the main application 

/***************************************************************************************************
 * HelloEndpoint
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
