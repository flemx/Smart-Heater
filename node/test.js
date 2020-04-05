/**
 *   Tes Client - Test servers
 *   @Damien_Fleminks
 *   4 April 2020
 */

var PROTO_PATH = __dirname + '/proto/temperature.proto';


var grpc = require('grpc');
var async = require('async');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var permissions_proto = grpc.loadPackageDefinition(packageDefinition).temperature;


//Client
var client = new permissions_proto.TemperatureService('localhost:50051',
grpc.credentials.createInsecure());



function startCallouts(){
    async.series([
        (callback) => {
            client.setTemp({tempVal: 15.3}, function(err, response) {
                console.log('\n Response: ',  response);
                callback();
            });
            
        },
        (callback) => {
          getTemp(callback);
        }
    ]); 


}

function getTemp(callback){
   console.log('EXECUTING: getTemp function \n');
   try{
        var call = client.getTemp();
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