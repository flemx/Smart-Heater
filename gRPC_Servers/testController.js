
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
var async = require('async');


const {SuperClient} = require('./SuperClasses');


//Client
var controllerClient = new SuperClient(
        grpc, protoLoader,'controller',
        'ControllerService', 'localhost','50052'
    );



function startCallouts(){
    async.series([
        (callback) => {
            getTempStream(callback);
        }
    ]); 


}

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