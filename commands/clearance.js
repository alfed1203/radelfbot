const _ = require("../utils");

const radelf = require("../radelf-client");
const secrets = require("../config/secrets");


module.exports = {
    viewer:         function(callback){
                        return callback;
                    },

    moderator:      function(callback){
                        var clearanceCheck = function(channel, userstate, message, self){
                            if(_.getUsername(userstate) == "alfred1203" || userstate.mod){
                                return callback(channel, userstate, message, self);
                            }
                        }
                        clearanceCheck.restricted = true;
                        clearanceCheck.mod = true;

                        return clearanceCheck;
                    },

    broadcaster:    function(callback){
                        var clearanceCheck = function(channel, userstate, message, self){
                            if(_.getUsername(userstate) == "alfred1203" || userstate.badges.broadcaster == 1 && userstate.badges != null){
                                return callback(channel, userstate, message, self);
                            }
                        }
                        clearanceCheck.restricted = true;
                        return clearanceCheck;
                    }
                }