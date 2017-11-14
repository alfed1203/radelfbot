const _ = require("lodash");
const radelfFunctions = require("../radelf-functions");

const radelf = require("../radelf-client");
const secrets = require("../config/secrets");


module.exports.viewer = function(callback){
    return callback;
}

module.exports.moderator = function(callback){
    var clearanceCheck = function(channel, userstate, message, self){
        if(radelfFunctions.getUsername(userstate) == "alfred1203" || userstate.mod){
            return callback(channel, userstate, message, self);
        }
    }
    clearanceCheck.restricted = true;

    return clearanceCheck;
}

module.exports.broadcaster = function(callback){
    var clearanceCheck = function(channel, userstate, message, self){
        if(radelfFunctions.getUsername(userstate) == "alfred1203" || userstate.badges.broadcaster == 1 && userstate.badges != null){
            return callback(channel, userstate, message, self);
        }
    }
    clearanceCheck.restricted = true;
    return clearanceCheck;
}