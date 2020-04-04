/**
 *   Main index file to start services
 *   @Damien_Fleminks
 *   01 April 2020
 */

var PROTO_PATH = __dirname + 'proto/permissions.proto';
var fs = require("fs");

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var permissions_proto = grpc.loadPackageDefinition(packageDefinition).permissions;


var userDB = JSON.parse(fs.readFileSync("usersDB.json"));


//CA Question 1
/**
 *  Authorize user by username and password
 * @param {*} call 
 * @param {*} callback 
 */
function authorise(call, callback){
    console.log('Authenticating user: ' + call.request.user);
    callback(null, isAuthorized(call.request));
}
function isAuthorized(user){
    for(let usr of userDB){
        if(user.user === usr.user && user.pwd === usr.password){
            return {
                isAuthorised: true,
                details : `User: ${user.user}, successfully authenticated`
            };
        }
    }
    return {isAuthorised: false, details: 'NO USER FOUND'};
}



//CA Question 2
/**
 *  Find user by userId (username) and return userinfo
 * @param {*} call 
 * @param {*} callback 
 */
function getUser(call, callback){
    console.log('Looking for user : ' + call.request.user);
    callback(null, findUser(call.request.user));
}
function findUser(userId){
    for(let usr of userDB){
        if(userId === usr.user){
            console.log('User found!');
            return {
                name: usr.infoName,
                tel : usr.infoTel,
                email : usr.infoEmail
            };
        }
    }
    return {
        name: '',
        tel : 0,
        email : ''
    };
}


//CA Question 3
/**
 *  Stream back email based on users
 * @param {*} call 
 */
function getEmails(call) {
    call.on('data', function(user) {
        console.log('Request to find email for:', user)
        for(let usr of userDB){
            if(user.user === usr.user){
                call.write({
                    user: usr.user,
                    email : usr.infoEmail,
                });
            }
        }
    });
    call.on('end', function() {
        call.end();
      });
 }


//CA Question 4
/**
 *  Return num of registered users
 * @param {*} call 
 */
function GetRegistered(call, callback) {
    //variable to count number of regiastered users 
    let numUsers = 0;

    call.on('data', function(user) {
        console.log('Request to find registered user:', user)
        for(let usr of userDB){
            if(user.user === usr.user && user.pwd === usr.password){
                numUsers++;
            }
        }
    });
    call.on('end', function() {
        // call.end();
        callback(null, {num: numUsers});
      });
 }




function main() {
    var server = new grpc.Server();
    server.addService(permissions_proto.PermissionService.service, {
        authorise: authorise,
        getUser: getUser,
        getEmails : getEmails,
        GetRegistered : GetRegistered
    });
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
  }
  
  main();
  