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
     * Constructor to start grps service from parent class and set variables
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
        this.streamEnabled = false;

        // Sets the current room Temperature, default is 20.2
        this.roomTemp = 20.2;
      }


    getTemp(call){
        call.on('data', function(streamTemp) {
            this.streamEnabled = streamTemp.enabled;
            this.streamEnabled ?  this.tempGenerator(call) : null;
        });
       call.on('end', function() {
            call.end();
        });
    }


    /**
     * Recursive method to write back the room temperature and adds random ratio
     * Purpose is to simulate slighty fluctuating temperature 
     * @param {*} call 
     */
    tempGenerator(call){
        // Stop recursive method if this.streamEnabled is set to false 
        if(this.streamEnabled){
            // generate random number between defined ratio of this.roomTemp
            let precision = 10; // 1 decimal
            let ratio = 0.8;
            let randomTemp = Math.floor(
                Math.random() * (
                    this.roomTemp + ratio * precision - this.roomTemp - ratio * precision
                ) + 1 * precision) / (1*precision);
            
            // write back the newly generated temperature value back to client
            call.write({
                tempVal: randomTemp
            });
            // Call the method again with time delay
            setTimeout(function() {
                //your code to be executed after 1 second
                this.tempGenerator(call);
            }, 1500);
           
        }

    }
      

    setTemp(){

    }

}

module.exports = Temperature;