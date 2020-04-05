/**
 *   Super Classses
 *   Parent Class for all grpc servers and clients
 *   @Damien_Fleminks
 *   04 April 2020
 */


 /**
  * SuperGrpc Class
  * Parent class for client and server class, containing common methods
  */
class SuperGrpc{

  
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

    this.PROTO_PATH = __dirname + `/../proto/${this.packageName}.proto`;
    this.packageDefinition = this.protoLoader.loadSync(
        this.PROTO_PATH,
        {keepCase: true,
         longs: String,
         enums: String,
         defaults: true,
         oneofs: true
        });
    this.permissions_proto =  this.grpc.loadPackageDefinition(this.packageDefinition)[this.packageName];

  }
}



/**
 *   SuperServer Client
 *   Parent Class for all grpc clients
 */
class SuperClient extends SuperGrpc{

   /**
     * Constructor to start grps service from parent class and set class properties
     */
  constructor(grpc, protoLoader, packageName, servicename, ipAddress, portNum) {
    super(
      grpc, protoLoader,packageName,
      servicename, ipAddress,portNum,
    );
    this.client = new this.permissions_proto[servicename](`${ipAddress}:${portNum}`,
    grpc.credentials.createInsecure());
  }
}



/**
 *   SuperServer Class
 *   Parent Class for all grpc servers
 */
class SuperServer extends SuperGrpc{

    /**
     * Constructor to start grps service from parent class and set class properties
     */
    constructor(grpc, protoLoader, packageName, servicename, ipAddress, portNum) {
        super(
          grpc, protoLoader,packageName,
          servicename, ipAddress,portNum,
        );
    
        //Adding method handler and server property
        this.methodHandlers = {};
        this.server = new this.grpc.Server();
      }

      /**
       * Method to start the gRPC server
       */
      startServer(){
        this.server.addService(this.permissions_proto[this.serviceName].service, this.methodHandlers);
        this.server.bind(`${this.ipAddress}:${this.portNum}`, this.grpc.ServerCredentials.createInsecure());
        this.server.start();
      }
      

}

module.exports = {SuperServer, SuperClient, SuperGrpc};