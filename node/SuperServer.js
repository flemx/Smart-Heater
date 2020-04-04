/**
 *   SuperServer Class
 *   Parent Class for all grpc servers
 *   @Damien_Fleminks
 *   04 April 2020
 */

class SuperServer {

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
        this.grpc = grpc;
        this.protoLoader = protoLoader;
        this.packageName = packageName;
        this.serviceName = servicename;
        this.ipAddress = ipAddress;
        this.portNum = portNum;
        this.methodHandlers = {};

        this.PROTO_PATH = __dirname + `/proto/${this.packageName}.proto`;
        this.packageDefinition = this.protoLoader.loadSync(
            this.PROTO_PATH,
            {keepCase: true,
             longs: String,
             enums: String,
             defaults: true,
             oneofs: true
            });
        this.permissions_proto =  this.grpc.loadPackageDefinition(this.packageDefinition)[this.packageName];
        this.server = new this.grpc.Server();
      }

      getTemptemp(){

      }

      setTemp(){

      }

      startServer(){
        this.server.addService(this.permissions_proto[this.serviceName].service, this.methodHandlers);
        this.server.bind(`${this.ipAddress}:${this.portNum}`, this.grpc.ServerCredentials.createInsecure());
        this.server.start();
      }
      

}

module.exports = SuperServer;