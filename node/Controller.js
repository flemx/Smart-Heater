/**
 *   Controller Class
 *   Main class to communicate to external gui client and manage all other services
 *   @Damien_Fleminks
 *   04 April 2020
 */




// Import parent classes
const {SuperServer, SuperClient, SuperGrpc} = require('./SuperClasses');

// Object to add clients
const clients = {};


class Controller extends SuperServer{
    /**
     * Constructor to start grps service from parent class and set class properties
     */
    constructor(grpc, protoLoader, conInfo) {
        super(
            grpc, protoLoader,'controller',
            'ControllerService', conInfo.host,conInfo.ControllerPort,
            );
        
        // Set method handles to define functions in proto upon starting the server
        this.methodHandlers = {
            getTempStream : this.getTempStream
        };

        // Initiate temperature Client
        clients.tempClient = new SuperClient(
            grpc, protoLoader,'temperature',
            'TemperatureService', conInfo.host,conInfo.TemperaturePort
        );
      }


    /**
     * getTempStream bidirectional streaming method to return the room temperature
     * @param {*} call 
     */
      getTempStream(call, callback){
        console.log('execute getTempStream()');
        call.on('data', function(streamTemp) {
            try{
                if(streamTemp.enabled){
                    clients.tempClient.client.getTemp({enabled: streamTemp.enabled}, function(err, response) {
                        console.log('\n Response: ',  response);
                        call.write(response);
                        //callback();
                    });
                }
            }catch(e){
                console.error('Error detected in getTempStream(): ', e.message);
                call.write({
                    tempVal: 0,
                    error : e.message
                });
            }
        });
       call.on('end', function() {
            call.end();
            callback();
        });
    }

}


module.exports = Controller;