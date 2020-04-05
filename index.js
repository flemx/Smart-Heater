/**
 *   Main index file to start all services
 *   @Damien_Fleminks
 *   01 April 2020
 */


const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


// Import Classes
const Temperature = require('./gRPC_Servers/Temperature');
const Controller = require('./gRPC_Servers/Controller');
const Authentication = require('./gRPC_Servers/Authentication');

// host and port details used for servers and clients
const conInfo = {
    host: 'localhost',
    TemperaturePort : '50051',
    ControllerPort : '50052',
    AuthenticationPort : '50053'
}


/**
 *  Start all the gRPC servers 
 */
function main() {
  const tempServer = new Temperature(
      grpc, 
      protoLoader,
      conInfo
      );
  tempServer.startServer();

  const controllerpServer = new Controller(
    grpc, 
    protoLoader,
    conInfo
    );
    controllerpServer.startServer();

  const authenticationServer = new Authentication(
    grpc, 
    protoLoader,
    conInfo
    );
    authenticationServer.startServer();
}
  
  main();
  