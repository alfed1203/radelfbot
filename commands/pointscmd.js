const radelfFunctions = require("../radelf-functions");
const queue = require("../message-queue");
const points = require("../misc/points");
const radelf = require("../radelf-client");
const secrets = require("../config/secrets");
const misc = require("../misc/misc");

const clearance = require("./clearance");

var commands= {
    "points":   clearance.viewer((channel, userstate) => {
                        var user = radelfFunctions.getUsername(userstate);
                        points.forEach(function(userpoints, index){
                            if(user == userpoints[0]){
                                if(userstate["message-type"] == "chat"){
                                    queue.addMessage(channel, "@" + user + " have " + userpoints[1] + " points");
                                } else if(userstate["message-type"] == "whisper"){
                                    queue.addWhisper(radelfFunctions.getUsername(userstate), "@" + user + " have " + userpoints[1] + " points");
                                }
                            }
                        })
                    }), 

    "top5":     clearance.viewer((channel, userstate) => {
                        var userstring = "";
                        points.sort(function(a,b){return b[1] - a[1]});
                        for(var i = 0; i < 5;i++){
                            if(points[i] == undefined)continue;
                            var string = (i+1) + ". " + points[i][0] + " with " + points[i][1] + " points. ";
                            userstring += string;
                        }
                        if(userstate["message-type"] == "chat"){
                            queue.addMessage(channel, userstring);
                        } else if(userstate["message-type"] == "whisper"){
                            queue.addWhisper(radelfFunctions.getUsername(userstate),userstring);
                        }
                    }),
    
    "givemine": clearance.viewer((channel,userstate, message) => {
                var messageArray = message.split(" ");
                var target = messageArray[1];
                var amount = parseInt(messageArray[2]);
                var user = radelfFunctions.getUsername(userstate);
                for(var i = 0; i < points.length; i++){
                    var userinfo = points[i];
                    if(user == userinfo[0]){
                        if(userinfo[1] >= amount){
                        points[i][1] = parseInt(userinfo[1]) - amount;
                        for(var x = 0; x < points.length;x++){
                            if(target == points[x][0]){
                                points[x][1] = parseInt(points[x][1]) + amount;
                                if(userstate["message-type"] == "chat"){
                                    queue.addMessage(channel, target + " got " + amount + " points");
                                } else if(userstate["message-type"] == "whisper"){
                                    queue.addWhisper(radelfFunctions.getUsername(userstate), target + " got " + amount + " points");
                                }
                                break;
                            }
                            if(points.length-1 == x && user != points[x][0]){
                                var newUser = [target,amount];
                                points.push(newUser);
                                break;
                            }
                        }
                        break;
                        } else {
                            queue.addMessage(channel, "insufficient points @" + user);
                            break;
                        }
                    }
                    
                }
        }),
    "give":     clearance.moderator((channel,userstate, message) => {
                        var messageArray = message.split(" ");
                        var target = messageArray[1];
                        var amount = parseInt(messageArray[2]);
                        for(var i = 0; i < points.length; i++){
                            var userinfo = points[i];
                            if(target == userinfo[0]){
                                points[i][1] = parseInt(userinfo[1]) + amount;
                                break;
                            } 
                            if(points.length-1 == i && target != userinfo[0]){
                                var newUser = [target,amount];
                                points.push(newUser);
                                break;
                            }
                        }
                        if(userstate["message-type"] == "chat"){
                            queue.addMessage(channel, target + " got " + amount + " points");
                        } else if(userstate["message-type"] == "whisper"){
                            queue.addWhisper(radelfFunctions.getUsername(userstate), target + " got " + amount + " points");
                        }
                }),
    "giveall":  clearance.broadcaster((channel, userstate, message, self) => {
                        var messageArray = message.split(" ");
                        var amount = parseInt(messageArray[1]);
                                misc.chatters.forEach(function(user){
                                    for(var i = 0; i < points.length; i++){
                                        var userinfo = points[i];
                                        if(user == userinfo[0]){
                                            points[i][1] = parseInt(userinfo[1]) + amount;
                                            break;
                                        } 
                                        if(points.length-1 == i && user != userinfo[0]){
                                            var newUser = [user,amount];
                                            points.push(newUser);
                                            break;
                                        }
                                    }
                                })
                                queue.addMessage(channel, "everyone got " + amount + " points!");
                    }),
}

module.exports = commands;