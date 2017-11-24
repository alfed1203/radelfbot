const queue = require("../message-queue");
const discord = require("discord.js");
const radelf = require("../radelf-client");
const _ = require("../utils");
const misc = require("../misc/misc");
const commands = require("../commands/commands");
const discordcommands = require("../commands/discordcommands");
const radelfDiscord = require("../radelfdiscord-client");
const readline = require("readline");
const broadcaster = require("../broadcaster-client");
const tmi = require("tmi.js");
const points = require("../misc/points");

module.exports = {
    join:       function(channel, username, self){
                    if(self){
                        if(channel != radelf.getChannels()[0]) return;
                        if(channel == "#alfred1203"){
                            queue.addMessage( channel, "Hello Team! :D I have awoken! Welcome back to the alfred1203 channel!");
                        } else{
                            queue.addMessage( channel, "Hello everybody! :D I have awoken! Welcome back to " + channel.slice(1) + "'s channel!");
                        }
                    } 
                    if(!misc.chatters.includes(username)){misc.chatters.push(username)};
                },
    disready:   function(){
                    _.logger("info", " discord ready");
                    const channel = radelfDiscord.channels.find('name', 'bot');
                    if(!channel)return;
                    channel.send("I have awoken");  
                },

    parts:      function(channel, username, self){
                    var index = misc.chatters.indexOf(username);
                    misc.chatters.splice(index,1);
                },

    part:       function(){
                    for( var hoster = 0; hoster < misc.ourHosts.length; hoster++ ){
                            radelf.say( radelf.getChannels()[0], "Thank you for hosting our stream to " + misc.ourHosts[hoster][1] + " today " + misc.ourHosts[hoster][0] + "! Check out our friend: twitch.tv/" + misc.ourHosts[hoster][0]);
                    }
                    
                    var channel = radelfDiscord.channels.find("name", "bot");
                    channel.send("Goodbye Team! I'm going to sleep.");

                    _.savePoints();

                    _.saveQuotes();

                    setTimeout(function(){
                        
                        if(radelf.getChannels()[0] == "#alfred1203"){
                            radelf.say( radelf.getChannels()[0], "Goodbye Team! I'm going to sleep.");
                        } else {
                            radelf.say( radelf.getChannels()[0], "Goodbye Everyone! I'm going to sleep.");
                        }
                        process.exit();
                    }, 500 * misc.ourHosts.length + 1000); // 1sec OR TRY .5secs * number of hosters + 1 = (500 * host.ourHosts.length + 1)
                },

    hosted:     function(channel, username, viewers){
                    if(viewers >= 3){
                        queue.addMessage(channel, username + " has hosted us to " + viewers + " viewers! Thank you ʕ•ᴥ•ʔ rawr!! Let's go check out their awesome channel: twitch.tv/" + username + "!");
                        misc.ourHosts.push([username, viewers]);
                        _logger("info", misc.ourHosts);
                    }
                },

    newFollow:  function(follower){
                    _.logger("info", "We have a new follower! " + follower);
                    _.giveAllPoints(10);
                    radelf.say(radelf.getChannels()[0], "Welcome to the team " + follower + "! :D");
                },
    
    newMember:  function(member){
                    const channel = member.guild.channels.find("name", "welcome");
                    if(!channel)return;
                    channel.send(`Welcom to the server, ${member}. Please check the #rules channel for rules. `);
                },
    
    ttmessage:  function(channel, userstate, message, self){
                    var username = _.getUsername(userstate);
                    if(self) return;
                    if(["chat", "action" , "whisper"].includes(userstate["message-type"])){
                        if(channel == radelf.getChannels()[0]){
                            for(var command in commands){
                                if( message === "!" + command || message.startsWith("!" + command + " ") ){
                                    try {
                                        commands[command](channel, userstate, message, self);
                                    } catch(err){
                                        _.logger("warn",`[${channel}] ${username} tried to execute '${command}'`);
                                        _.logger("error",err);
                                    }
                                    break;
                                }
                            }
                        }
                    };
                    if(!misc.chatters.includes(username)){
                        misc.chatters.push(username);
                    }
                },
    
    dismessage: function(message){
                    var username = message.author.username;
                    if(message.channel.name != "bot") return;
                    _.logger("info", ` [discord] <${username}>: ${message.content}` );
                    if(message.author.username == "RadElfBot") return;
                
                    switch(message.channel.type){
                        case "text":
                            for(var command in discordcommands){
                                if( message.content === "!" + command || message.content.startsWith("!" + command + " ") ){
                                    try {
                                        discordcommands[command](message);
                                    } catch(err){
                                        _.logger("warn",`[discord] ${username} tried to execute '${command}'`);
                                        _.logger("error",err);
                                    }
                                    break;
                                }
                            }
                        case "dm":
                        break;
                        case "group":
                        break;
                        default:
                            break;
                    }
                },
    listen:     function(){
                var rl = readline.createInterface(process.stdin, process.stdout);
                rl.prompt();
                rl.on("line", line=>{
                    if(line.startsWith("/w")){
                        var messageArr = line.split(" ");
                        var user = messageArr[1];
                        var message = line.slice(("/w " + user).length);
                        broadcaster.whisper(user, message);
                        rl.close();
                    } else {
                        broadcaster.say("alfred1203", line);
                        rl.close();
                    }
                    })
                },
    banned:     function(channel, username){
                    points[username] = 0;
                }
            }
