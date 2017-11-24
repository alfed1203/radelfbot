const secrets = require("./config/secrets");
const radelf = require("./radelf-client");
const tmi = require("tmi.js");
const points = require("./misc/points");
const quotes = require("./misc/quotes");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");

var utils = {
    getUsername:            (userstate) => {
                                return userstate.username || userstate["display-name"];
                                },

    getArrayElement:        (array) => {
                                return array[Math.floor(Math.random() * array.length)];
                                },

    queryTwitchAPI:         (queryUrl) => {
                                return {
                                    url: "https://api.twitch.tv/kraken/" + queryUrl,
                                    headers: {
                                        "Accept": "application/vnd.twitchtv.v5+json",
                                        "Authorization": "OAuth " + secrets.broadcaster.password,
                                        "Client-ID": secrets.clientId
                                        }
                                    };
                                },

    savePoints:             function(){
                                var content = "";
                                var users = Object.keys(points);
                                users.forEach(function(user){
                                    var string = `${user}:${points[user]},`
                                    content += string;
                                })
                                var endcontent = "var points = {" + content + "}; module.exports = points;";
                                    var root = __dirname;
                                    var file = path.resolve(root, "misc", "points.js")
                                    fs.writeFile(file, endcontent , function (err) {
                                        if (err) throw err;
                                        utils.logger("info", "points Saved!");
                                    });
                                },

    saveQuotes:             function(){
                                var quotecontent = "";
                                for(var i = 0;i < quotes.length; i++){
                                    var quote = quotes[i];
                                    var string = '"' + quote + '"';
                                    if(i != quotes.length-1) { string += ","};
                                        quotecontent += string;
                                    }
                                    var content = "var quotes = [" + quotecontent +"]; module.exports = quotes;";
                                        
                                    var root = __dirname;
                                    var file = path.resolve(root, "misc", "quotes.js")
                                    fs.writeFile(file, content , function (err) {
                                        if (err) throw err;
                                        utils.logger("info", "quotes Saved!");
                                    });
                                },

    enoughPoints:           function(user, amount){
                                if(points.hasOwnProperty(user)){
                                    if(points[user] >= amount){
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                                },

    giveAllPoints:          function(amount){
                                chatter.chatters.forEach(function(user){
                                    if(points.hasOwnProperty(user)){
                                        points[user] = points[user] + amount;
                                    } else {
                                        points[user] = amount;
                                    }
                                    })
                                logger("info", `everyone got ${amount} points`);
                                },

    formatDate:             function(date){
                                var hours = date.getHours();
                                var mins  = date.getMinutes();
                                var secs = date.getSeconds();

                                hours = (hours < 10 ? "0" : "") + hours;
                                mins = (mins < 10 ? "0" : "") + mins;
                                secs = (secs < 10 ? "0" : "") + secs;

                                return `${hours}:${mins}:${secs}`;
                                },
    logger:                 function(level, message){
                            function chalkfun(level){
                                if(level == "trace"){return chalk.white(level)};
                                if(level == "debug"){return chalk.green(level)};
                                if(level == "info"){return chalk.blue(level)};
                                if(level == "warn"){return chalk.yellow(level)};
                                if(level == "error"){return chalk.red(chalk.bgWhite(level))};
                                if(level == "fatal"){return chalk.magenta(chalk.bgWhite(level))};
                            }
                            console.log(`[${this.formatDate(new Date())}] ${chalkfun(level)} : ${message}`);
                            
                            },
    defaults:               function(args){
                            return _.defaults(args);
                            }
}

module.exports = utils;