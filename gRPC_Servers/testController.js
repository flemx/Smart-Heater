/**
 *   Test all the services 
 *   @Damien_Fleminks
 *   04 April 2020
 */

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
var async = require('async');
var bonjour = require('bonjour')()
 
// advertise an HTTP server on port 3005
bonjour.publish({ name: 'My Web Server', type: 'http', port: 3005 })



// Import 
const {SuperClient} = require('./SuperClasses');

 
//Client for controller server
var controllerClient = new SuperClient(
        grpc, protoLoader,'controller',
        'ControllerService', 'localhost','50052'
    );

//Client for authentication server
var authenticationClient = new SuperClient(
    grpc, protoLoader,'authentication',
    'AuthenticationService', 'localhost','50053'
);



/**
 * Asyncronously run all tests in series
 */
function startCallouts(){
    async.series([
        
        (callback) => {
            // browse for all http services using jmDNS
            bonjour.find({ type: 'http' }, function (service) {
                console.log('Found an HTTP server:', service);
                callback();
            })
        },
        (callback) => {
            // Authenticating user
            authenticationClient.client.authorise({user: 'damien', pwd : 'pass123'}, function(err, response) {
                console.log('\n Response: ',  response);
                callback();
            });
        },
        (callback) => {
            getTempStream(callback);
        }
    ]); 


}

/**
 *  Function to receive continues stream of data form the server with temperature value
 * @param { } callback 
 */
function getTempStream(callback){
   console.log('EXECUTING: getTempStream function \n');
   try{
        var call = controllerClient.client.getTempStream();
        call.on('data', function(temp) {
            console.log('Current Temp is: ' + temp.tempVal);
        });
        call.on('end', callback);

        let tempGen = setInterval(function(){ 
            call.write({enabled:true});
        }, 2000);
        // call.end();
   }catch(e){
        console.error('error while executing getTemp()', e);
   }
  
}



/**
 *  Start client application
 */
startCallouts();