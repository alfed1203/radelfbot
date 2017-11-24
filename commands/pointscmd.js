const _ = require("../utils");
const queue = require("../message-queue");
const points = require("../misc/points");
const radelf = require("../radelf-client");
const secrets = require("../config/secrets");
const misc = require("../misc/misc");

const clearance = require("./clearance");

var commands= {
    "points":   clearance.viewer((channel, userstate) => {
                        var user = _.getUsername(userstate);
                        if(points.hasOwnProperty(user)){
                            if(userstate["message-type"] == "chat"){
                                    queue.addMessage(channel, "@" + user + " have " + points[user] + " points");
                                } else if(userstate["message-type"] == "whisper"){
                                    queue.addWhisper(_.getUsername(userstate), "@" + user + " have " + points[user] + " points");
                                }
                        }
                    }), 
    
    "givemine": clearance.viewer((channel,userstate, message) => {
                var messageArray = message.split(" ");
                var target = messageArray[1];
                var amount = parseInt(messageArray[2]);
                var user = _.getUsername(userstate);
                if(points.hasOwnProperty(user)){
                    if(_.enoughPoints(user, amount)){
                        if(points.hasOwnProperty(target)){
                            points[target] += amount;
                            points[user] -= amount;
                            if(userstate["message-type"] == "chat"){
                                queue.addMessage(channel, target + " got " + amount + " points");
                            } else if(userstate["message-type"] == "whisper"){
                                queue.addWhisper(_.getUsername(userstate), target + " got " + amount + " points");
                            }
                        } else {
                            points[target] = amount;
                            points[user] -= amount;
                            if(userstate["message-type"] == "chat"){
                                queue.addMessage(channel, target + " got " + amount + " points");
                            } else if(userstate["message-type"] == "whisper"){
                                queue.addWhisper(_.getUsername(userstate), target + " got " + amount + " points");
                            }
                        }
                    } else{
                        queue.addMessage(channel, `@${user} insufficient points!`);
                    }
                }
        }),
    "give":     clearance.moderator((channel,userstate, message) => {
                        var messageArray = message.split(" ");
                        var target = messageArray[1];
                        var amount = parseInt(messageArray[2]);
                        if(points.hasOwnProperty(target)){
                            points[target] += amount;
                        } else {
                            points[target] = amount;
                        }
                        if(userstate["message-type"] == "chat"){
                            queue.addMessage(channel, target + " got " + amount + " points");
                        } else if(userstate["message-type"] == "whisper"){
                            queue.addWhisper(_.getUsername(userstate), target + " got " + amount + " points");
                        }
                }),
    "giveall":  clearance.broadcaster((channel, userstate, message, self) => {
                        var messageArray = message.split(" ");
                        var amount = parseInt(messageArray[1]);
                        misc.chatters.forEach(function(user){
                            if(points.hasOwnProperty(user)){
                                points[user] += amount;
                            } else {
                                points[user] = amount;
                            }
                                })
                                queue.addMessage(channel, "everyone got " + amount + " points!");
                    }),
}

module.exports = commands;