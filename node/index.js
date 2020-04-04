/**
 *   Main index file to start services
 *   @Damien_Fleminks
 *   01 April 2020
 */


const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


// Import Classes
const Temperature = require('./Temperature');



function main() {
  const tempServer = new Temperature(
      grpc, 
      protoLoader, 
      'temperature', 
      'TemperatureService',
      '0.0.0.0',
      '50054'
      );
  tempServer.startServer();
  }
  
  main();
  