/**
 *   Temperature Class
 *   Initialises temperature sensor server and extends SuperServer Class
 *   @Damien_Fleminks
 *   04 April 2020
 */

// Import parent class
const SuperServer = require('./SuperServer');


class Temperature extends SuperServer{

    /**
     * Constructor to initialise grps service
     * @param {*} grpc 
     * @param {*} protoLoader 
     * @param {*} packageName 
     * @param {*} servicename 
     * @param {*} ipAddress 
     * @param {*} portNum 
     */
    constructor(grpc, protoLoader, packageName, servicename, ipAddress, portNum) {
        super(
            grpc, protoLoader,packageName,
            servicename, ipAddress,portNum,
            );
        
        // Set method handles to define functions in proto upon starting the server
        this.methodHandlers = {
            getTemp : this.getTemp,
            setTemp : this.setTemp
        };
      }

      getTemp(){
        call.on('data', function(user) {
            console.log('Request to find email for:', user)
            for(let usr of userDB){
                if(user.user === usr.user){
                    call.write({
                        user: usr.user,
                        email : usr.infoEmail,
                    });
                }
            }
        });
        call.on('end', function() {
            call.end();
          });
      }

      setTemp(){

      }

}

module.exports = Temperature;