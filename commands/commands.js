const _ = require("lodash");
const radelfFunctions = require("../radelf-functions");
const queue = require("../message-queue");
const points = require("../misc/points");
const radelf = require("../radelf-client");
const secrets = require("../config/secrets");
const quotes = require("../misc/quotes");
const songs = require("../misc/song");
const help = require("../misc/help");
const misc = require("../misc/misc");
const clearance = require("./clearance");
const pointcmd = require("./pointscmd");
const raid = require("./raids");

const reply = (text) => clearance.viewer((channel, userstate) => {
    if(userstate["message-type"] == "chat"){
        queue.addMessage( channel, "@" + radelfFunctions.getUsername(userstate) + ", " + text);
    } else if(userstate["message-type"] == "whisper"){
        queue.addWhisper(radelfFunctions.getUsername(userstate), text);
    }
});


var commands = {

    "github": reply("https://github.com/alfred1203"),
    "gitlab": reply("https://gitlab.com/alfred1203"),
    "discord": reply("https://discord.gg/BbBZafb"),

    "goodbye":      clearance.viewer(
                        function(channel, userstate){
                            if(userstate["message-type"] == "whisper")  return;
                            queue.addMessage( channel, "Goodbye " + radelfFunctions.getUsername(userstate) + "! See you next stream :)" );
                        }),
    
    "hello":         clearance.viewer(
                        function(channel, userstate){
                            if(userstate["message-type"] == "whisper")  return;
                            queue.addMessage( channel, "Hello " + radelfFunctions.getUsername(userstate) + "! rawr" );
                        }),
    
    "help":         clearance.viewer(
                        function(channel, userstate,message){
                            var messageArray = message.split(" ");
                            var targetcmd = messageArray[1];
                            if (targetcmd == undefined || Object.keys(help).includes(targetcmd)){
                                if(targetcmd == "modcmd")return;
                                msg = help[targetcmd];
                            } else {
                                msg = "unknown command";
                            }
                            if(userstate["message-type"] == "whisper"){
                                queue.addWhisper(radelfFunctions.getUsername(userstate), msg);
                            }else if(userstate["message-type"] == "chat"){
                                queue.addMessage(channel, "@" + radelfFunctions.getUsername(userstate) + ", " + msg);
                            }
                        }),
    "pet":          clearance.viewer(
                        function(channel, userstate){
                            var username = radelfFunctions.getUsername(userstate);
                            queue.addMessage( channel, "/me purrs while " + username + " pets his head OhMyDog");
                        }),
    
    "rawr":         clearance.viewer(
                        function(channel){
                            queue.addMessage(channel, "ʕ•ᴥ•ʔ RAWR");
                        }),

    "uptime":       clearance.viewer(
                        function(channel, userstate){
                            if(radelf.broadcasterID != "#"){
                                var streamStart = Date.now();

                                radelf.api({
                                    url: "https://api.twitch.tv/kraken/streams/" + radelf.broadcasterID,
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/vnd.twitchtv.v5+json",
                                        "Authorization": secrets.broadcaster.password,
                                        "Client-ID": secrets.clientId
                                    }
                                }, function(err, res, body) {
                                    if(!err && body.stream != null){
                                        streamStart = new Date(body.stream.created_at);

                                        var diff = Math.floor((Date.now() - streamStart) / 1000);
                                        var hours = Math.floor(diff / 60 / 60);
                                        var minutes = Math.floor(diff / 60) % 60;
                                        var seconds = Math.floor(diff - (hours * 60 * 60) - (minutes * 60));

                                        queue.addMessage(channel, "alfred1203 has been LIVE for: " + hours + " hours " + minutes + " minutes " + seconds + " seconds. rawr");
                                    } else {
                                        queue.addMessage(channel, "alfred1203 is offline");
                                    }
                                });
                            }
                        }),
    "addquote":     clearance.viewer(
                        function(channel, userstate, message){
                            var user = radelfFunctions.getUsername(userstate);
                            var confrom = radelfFunctions.enoughPoints(user, 50);
                            if(confrom[0] == true){
                                var quote = message.slice("!addquote ".length);
                                quotes.push(quote);
                                points[confrom[1]][1] = parseInt(points[confrom[1]][1]) - 50;
                                radelfFunctions.saveQuotes();
                                queue.addMessage(channel, "quote added!");
                            } else {
                                queue.addWhisper(user, "not enought points");
                            }
                        }),
    "songrequest":  clearance.viewer(
                            function(channel, userstate, message){
                                if(typeof sr === "undefined" || !sr){sr = false; queue.addMessage(channel, "songrequest is off") ;return;}
                                var url = message.slice("!songrequest ".length);
                                if(url == ""){ queue.addMessage(channel, "no link given"); return;};
                                var user = radelfFunctions.getUsername(userstate);
                                var confrom = radelfFunctions.enoughPoints(user, 15);
                                if(confrom[0] == true){
                                    songs.songs.push(url);
                                    points[confrom[1]][1] = parseInt(points[confrom[1]][1]) - 15;
                                    queue.addMessage(channel, "song added to the queue");
                                } else{
                                    queue.addWhisper(user, "not enought points");
                                }

                            }
                        ),
    "vote":         clearance.viewer(
                        function(channel, userstate, message){
                            if(typeof voting === "undefined" || !voting){voting = false;queue.addMessage(channel, "There's no open poll at the moment"); return;}                            var option = message.slice("!vote ".length);
                            var user = radelfFunctions.getUsername(userstate);
                            if(option > Object.keys(misc.poll.options).length)return;
                            if(!misc.voters.includes(user)){
                                misc.poll[option] += 1;
                                misc.voters.push(user);
                            } else {
                                var conform = radelfFunctions.enoughPoints(user, 10);
                                if(conform[0] != true){queue.addWhisper(user, "not enought points"); return;}
                                misc.poll[option] += 1;
                                points[conform[1]][1] = parseInt(points[conform[1]][1]) - 10;
                            }
                        }),
    "poll":         clearance.viewer(
                        function(channel){
                            if(typeof voting === "undefined" || !voting){voting = false;queue.addMessage(channel, "There's no open poll at the moment"); return;}                            var string = pollTitle;
                            Object.keys(misc.poll.options).forEach((option, index, array) => {
                                str = (index+1) + ": " + misc.poll.options[option];
                                if(index != array.length){ string += ", "};
                                string += str;
                            })
                            queue.addMessage(channel, string);
                        }),
    "join": clearance.viewer(
                        function(channel, userstate){
                            if(typeof giveAway === "undefined" || !giveAway){giveAway = false; queue.addMessage(channel, "There's no giveaway at the moment"); return;};
                            var user = radelfFunctions.getUsername(userstate);
                            if(!misc.giveaway.includes(user)){
                                misc.giveaway.push(user); 
                            } else {
                                var conform = radelfFunctions.enoughPoints(user, 50);
                                if(!conform[0]){return;};
                                misc.giveaway.push(user);
                                points[conform[1]][1] = parseInt(points[conform[1]][1]) - 50;
                            }
                        }),
    
    /*** MODERATOR COMMANDS ***/

    "flushqueue":   clearance.moderator(
                        function(channel){
                            queue.flushQueue(channel, "I emptied my message queue.");
                        }),
    "shoutout":     clearance.moderator(
                        function(channel, userstate, message){
                            queue.addMessage(channel, "Shoutout to our friend @" + message.slice("!shoutout ".length) + "!! Check out their awesome channel: https://twitch.tv/" + message.slice("!shoutout ".length) + "!");
                        }),
    "savepoints":   clearance.moderator(
                        function(channel){
                            radelfFunctions.savePoints();
                        }),
    "modcmd":       clearance.moderator(
                        function(channel, userstate){
                            if(userstate["message-type"] == "whisper"){
                                queue.addWhisper(radelfFunctions.getUsername(userstate), help["modcmd"]);
                            }else if(userstate["message-type"] == "chat"){
                                queue.addMessage(channel, "@" + radelfFunctions.getUsername(userstate) + ", " + help["modcmd"]);
                            }
                        }),
    "warn":         clearance.moderator(
                        function(channel, userstate, message){
                            var target = message.slice("!warn ".length);
                            if(!misc.mod.warn.includes(target)){
                                misc.mod.warn.push(target);
                                var conform = radelfFunctions.enoughPoints(target, 0);
                                points[conform[1]][1] = parseInt(points[conform[1]][1]) - 100;
                                queue.addMessage(channel, target + " , you are warned! next warning is a 5 mins timeout!");
                            } else {
                                if(misc.mod.timeout.includes(target)){
                                    var conform = radelfFunctions.enoughPoints(target, 0);
                                    points[conform[1]][1] = 0;
                                    radelf.ban(channel,target);
                                    queue.addMessage(channel, target + " , you have been banned from chat!!");
                                } else {
                                    misc.mod.timeout.push(target);
                                    var conform = radelfFunctions.enoughPoints(target, 0);
                                    points[conform[1]][1] = parseInt(points[conform[1]][1]) - 200;
                                    radelf.timeout(channel, target, 300);
                                    queue.addMessage(channel, target + " , you have been timed out for 5 mins! next warning will result in a ban from chat!!");
                                }
                            }
                        }),

    /*** BROADCASTER COMMANDS ***/
    "sron":         clearance.broadcaster(
                        function(channel){
                            queue.addMessage(channel, "songrequest on!");
                            sr = true;
                        }),
    "sroff":        clearance.broadcaster(
                        function(channel){
                            queue.addMessage(channel, "songrequest off!");
                            sr = false
                        }),
    "polltitle":    clearance.broadcaster(
                        function(channel, userstate, message){
                            var title = message.slice("!polltitle ".length);
                            pollTitle = title;
                        }),
    "newpoll":      clearance.broadcaster(
                        function(channel, userstate, message){
                            if(typeof voting !== "undefined" && voting)return;
                            voting = true;
                            var messageArray = message.split(" ");
                            var string = "Poll opened! use !vote [index] to cast your vote. " + pollTitle +" Options are ";
                            for (var i = 1; i < messageArray.length; i++) {
                                misc.poll.options[i] = messageArray[i];
                                misc.poll.poll[i] = 0;
                                str = [i] + ":" + messageArray[i];
                                string += str;
                                if(i != messageArray.length -1){ string += ", "}
                            }
                            string += ". First vote is free! each vote after the first cost 10 points";
                            misc.poll.voters = [];
                            queue.addMessage(channel, string);
                        }),
    "pollresults":  clearance.broadcaster(
                        function(channel){
                            if(typeof voting === "undefined"){voting = false; return;};
                            var sortedpoll = Object.keys(misc.poll.poll).sort(function(a,b){return misc.poll.poll[b]-misc.poll.poll[a]});
                            var string = pollTitle + " Here's the result: ";
                            var index = 1;
                            for (var x in sortedpoll) {
                                var y = sortedpoll[x]
                                objstr = index + ": " + misc.poll.options[y] + " with " + misc.poll.poll[y] + " votes. ";
                                string += objstr
                                index++ 
                            }
                            queue.addMessage(channel, string);
                        }),
    "endpoll":      clearance.broadcaster(
                        function(channel){
                            if(typeof voting === "undefined" || !voting){voting = false; return;};
                            voting = false;
                            var sortedpoll = Object.keys(misc.poll.poll).sort(function(a,b){return misc.poll.poll[b]-misc.poll.poll[a]});
                            var string = pollTitle + " Here's the result: ";
                            var index = 1;
                            for (var x in sortedpoll) {
                                var y = sortedpoll[x]
                                objstr = index + ": " + misc.poll.options[y] + " with " + misc.poll.poll[y] + " votes. ";
                                string += objstr
                                index++ 
                            }
                            queue.addMessage(channel, string);
                        }),
    "test":         clearance.broadcaster(
                        function(channel){
                            if(points.includes("alfred1203")){console.log("yes")};
                            console.log(chatters.chatters);
                        }),
    "giveaway":     clearance.broadcaster(
                        function(channel, userstate, message){
                            if(typeof giveAway !== "undefined" && giveAway)return;
                            giveAway = true;
                            var prize = message.slice("!giveaway ".length);
                            if(prize != undefined){prize = " for " + prize};
                            if(prize == undefined){prize = ""};
                            giveawayPrize = prize;
                            misc.giveaway = [];
                            queue.addMessage(channel, "A giveaway have been started!! use !joingiveaway to join the giveaway" + giveawayPrize + "! Everyone gets one free token! Each token after is 50 points.");
                        }),
    "endgiveaway":  clearance.broadcaster(
                        function(channel){
                            if(typeof giveAway === "undefined" || !giveAway){giveAway = false; return;}
                            giveAway = false;
                            var winner = radelfFunctions.getArrayElement(misc.giveaway);
                            console.log("[%s] info: the winner is %s", radelfFunctions.formatDate(new Date()), winner);
                            if(winner == undefined){queue.addMessage(channel, "no one joined the giveaway!");return;};                            
                            queue.addMessage(channel, "The winner of the giveaway is ... " + winner);
                        }),
};

Object.assign(commands, raid.commands);
Object.assign(commands, pointcmd);

module.exports = commands;