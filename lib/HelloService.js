var carbon = require('carbon-io')
var __     = carbon.fibers.__(module)
var _o     = carbon.bond._o(module)
var o      = carbon.atom.o(module).main // Note the .main here since this is the main application 

/***************************************************************************************************
 * HelloService
 *
 * Hello-world example. 
 */
__(function() {
  module.exports = o({

    /***************************************************************************
     * _type
     */
    _type: carbon.carbond.Service,

    /***************************************************************************
     * description
     */
    description: "Advanced hello-world service using MongoDB",

    /***************************************************************************
     * environmentVariables
     */
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
    
    /***************************************************************************
     * port
     */
    port: 8888,

    /***************************************************************************
     * dbUri
     */
    dbUri: _o('env:MONGODB_URI') || "mongodb://localhost:27017/hello-world",

    /***************************************************************************
     * defaultLocale
     */
    defaultLocale: _o('env:LOCALE') || "en",

    /***************************************************************************
     * endpoints
     */
    endpoints : {
      hello: _o('./HelloEndpoint'),
      greetings: _o('./GreetingsEndpoint')
    }

  })
})
