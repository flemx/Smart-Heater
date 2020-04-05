/**
 *   Authentication Class
 *   Initialises Authentication server and extends SuperServer Class
 *   @Damien_Fleminks
 *   04 April 2020
 */

// Import parent class
const {SuperServer} = require('./SuperClasses');

// Setup json file for temp database
const fs = require("fs");
const users = JSON.parse(fs.readFileSync("users.json"));


class Authentication extends SuperServer{

    /**
     * Constructor to start grps service from parent class and set class properties
     */
    constructor(grpc, protoLoader, conInfo) {
        super(
            grpc, protoLoader,'authentication',
            'AuthenticationService', conInfo.host,conInfo.AuthenticationPort,
            );
        
        // Set method handles to define functions in proto upon starting the server
        this.methodHandlers = {
            authorise : this.authorise
        };
      }

    /**
     * authorise function to authenticate a user
     * @param {*} call 
     * @param {*} callback 
     */
    authorise(call, callback){
        console.log('Authenticating user: ' + call.request.user);
        callback(null, isAuthorized(call.request));
    }


}

    /**
     * Method to check authentication on users json file
     * @param {*} user 
     */
    function isAuthorized(user){
        for(let usr of users){
            if(user.user === usr.user && user.pwd === usr.password){
                return {
                    isAuthorised: true,
                    details : `User: ${user.user}, successfully authenticated`
                };
            }
        }
        return {isAuthorised: false, details: 'NO USER FOUND'};
    }


module.exports = Authentication;