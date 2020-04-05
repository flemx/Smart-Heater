/**
 *   Temperature Class
 *   Initialises temperature sensor server and extends SuperServer Class
 *   @Damien_Fleminks
 *   04 April 2020
 */

// Import parent class
const {SuperServer} = require('./SuperClasses');

const baseTemp = 20.2;
let roomTemp = baseTemp;

class Temperature extends SuperServer{

    /**
     * Constructor to start grps service from parent class and set class properties
     */
    constructor(grpc, protoLoader, conInfo) {
        super(
            grpc, protoLoader,'temperature',
            'TemperatureService', conInfo.host,conInfo.TemperaturePort,
            );
        
        // Set method handles to define functions in proto upon starting the server
        this.methodHandlers = {
            getTemp : this.getTemp,
            setTemp : this.setTemp,
        };
        this.streamEnabled = false;

        // Sets the current room Temperature, default is 20.2
        this.roomTemp = 20.2;
      }

    /**
     * setTemp function to set the current room temperature
     * @param {*} call 
     * @param {*} callback 
     */
    setTemp(call, callback){
        let setConfirmed = {
            confirmed : false,
            error : null
        };
        try{
            console.log('Setting temperature to : ' + call.request.tempVal);
            roomTemp = call.request.tempVal;
            console.log('Check room temp: ' + roomTemp);
            setConfirmed.confirmed = true;
        }catch(e){
            console.error('Error executing setTemp()', e.message);
            setConfirmed.error =  e.message;
        }
        callback(null, setConfirmed);
        
    }


    /**
     * Return the room temperature
     * Purpose is to simulate slighty fluctuating temperature by adding small random decimal
     * @param {*} call 
     */
    getTemp(call, callback){
        console.log('execute getTemp()');
        try{
            if(call.request.enabled){
                let ramTemp = ( roomTemp + Math.random() * (0.8 - 0.4 + 0.4) + 0.1).toFixed(2);
                console.log(ramTemp);
                callback(null, {
                    tempVal: ramTemp,
                    error : null
                });
            }
        }catch(e){
            console.error('Error detected in getTemp(): ', e.message);
            callback(null, {
                tempVal: 0,
                error : e.message
            });
        }
    }


}


module.exports = Temperature;