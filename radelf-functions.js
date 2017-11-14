const secrets = require("./config/secrets");
const radelf = require("./radelf-client");
const tmi = require("tmi.js");
const points = require("./misc/points");
const quotes = require("./misc/quotes");
const fs = require("fs");


module.exports.getUsername =        function (userstate){
                                        return userstate.username || userstate["display-name"];
                                    }

module.exports.getArrayElement =    function(array){
                                        return array[Math.floor(Math.random() * array.length)];
                                    }

module.exports.queryTwitchAPI =     function(queryUrl){
                                        return {
                                            url: "https://api.twitch.tv/kraken/" + queryUrl,
                                            headers: {
                                                "Accept": "application/vnd.twitchtv.v5+json",
                                                "Authorization": "OAuth " + secrets.broadcaster.password,
                                                "Client-ID": secrets.clientId
                                            }
                                        };
                                    }

module.exports.savePoints =         function(){
                                        var content = "";
                                        for(var i = 0;i < points.length; i++){
                                            var string = points[i][0] + "|" + points[i][1];
                                            if(i != points.length-1) { string += " "};
                                            content += string;
                                        }
                                        fs.writeFile('points.txt', content , function (err) {
                                            if (err) throw err;
                                            console.log('[' + formatdate(new Date()) + '] [files] info: points Saved!');
                                        });
                                    }

module.exports.saveQuotes =         function(){
                                        var content = "";
                                        for(var i = 0;i < quotes.length; i++){
                                            var string = quotes[i];
                                            if(i != quotes.length-1) { string += "|"};
                                            content += string;
                                        }
                                        fs.writeFile('quotes.txt', content , function (err) {
                                            if (err) throw err;
                                            console.log('[' + formatdate(new Date()) + '] [files] info: quotes Saved!');
                                        });
                                    }

module.exports.enoughPoints = function(user, amount){
                                for(var i = 0; i < points.length; i++){
                                    if(points[i][0] == user){
                                        if(points[i][1] >= amount){
                                            return [true, i];
                                        } else {
                                            return false;
                                        }
                                    }
                                    if(i == points.length-1 && points[i][0] != user){
                                        return false;
                                    }
                                }
}

module.exports.giveAllPoints = function(amount){
    chatter.chatters.forEach(function(user){
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
    console.log("[" + formatdate(new Date()) +"] info: everyone got " + amount +" points");
}

module.exports.formatDate = function(date){
    var hours = date.getHours();
    var mins  = date.getMinutes();
    var secs = date.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    mins = (mins < 10 ? "0" : "") + mins;
    secs = (secs < 10 ? "0" : "") + secs;

    return `${hours}:${mins}:${secs}`;
}

function formatdate(date){
    var hours = date.getHours();
    var mins  = date.getMinutes();
    var secs = date.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    mins = (mins < 10 ? "0" : "") + mins;
    secs = (secs < 10 ? "0" : "") + secs;

    return `${hours}:${mins}:${secs}`;
}