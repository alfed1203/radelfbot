const _ = require("lodash");
const radelfFunctions = require("./radelf-functions");
const queue = require("./message-queue");

const tmi = require("tmi.js");
const config = require("./config/config");
const secrets = require("./config/secrets");
const Discord = require("discord.js")

const commands = require("./commands/commands");
const discordcommands = require("./commands/discordcommands");

const events = require("./events/events");
const followers = require("./events/followers");

const timers = require("./timers/timers");

const radelf = require("./radelf-client");
const radelfDiscord = require("./radelfdiscord-client");

radelf.connect();
radelfDiscord.login(secrets.discord.token);

const broadcaster = new tmi.client(
    _.defaults({
        identity: secrets.broadcaster
    },  require ("./config/config")));
broadcaster.connect();

radelf.on("message", function(channel, userstate, message, self){
    var username = radelfFunctions.getUsername(userstate);
    if(self) return;
    if(["chat", "action" , "whisper"].includes(userstate["message-type"])){
        if(channel == radelf.getChannels()[0]){
            for(var command in commands){
                if( message === "!" + command || message.startsWith("!" + command + " ") ){
                    try {
                        commands[command](channel, userstate, message, self);
                    } catch(err){
                        console.log("[%s] %s tried to execute '%s'", channel, username, command);
                        console.log(err);
                    }
                    break;
                }
            }
        }
    };
});

radelfDiscord.on('message', message => {
    var username = message.author.username;
    if(message.channel.name != "bot") return;
    console.log("[%s] [discord] <%s>: %s" , radelfFunctions.formatDate(new Date()), username, message.content);
    if(message.author.username == "RadElfBot") return;

    switch(message.channel.type){
        case "text":
            for(var command in discordcommands){
                if( message.content === "!" + command || message.content.startsWith("!" + command + " ") ){
                    try {
                        discordcommands[command](message);
                    } catch(err){
                        console.log("[%s] [%s]  tried to execute '%s'", radelfFunctions.formatDate(new Date()),username, command);
                        console.log(err);
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
})

radelfDiscord.on('guildMemberAdd' , member => {
    const channel = member.guild.channels.find("name", "welcome");
    if(!channel)return;
    channel.send("Welcom to the server, ${member}. Please check the #rules channel for rules. If you want to join the nsfw channel use the !nsfw command in #bot");
})

radelf.on("join", function(channel, username, self){
    events.join(channel, username, self);
});

radelf.on("part", (channel, username, self) => {
    events.parts(channel, username, self);
})

radelfDiscord.on('ready', () => {
    console.log("[" + radelfFunctions.formatDate(new Date()) + "] info: discord ready");
    const channel = radelfDiscord.channels.find('name', 'bot');
    if(!channel)return;
    channel.send("I have awoken");  

});

process.on("SIGINT", function(){
    events.part();
});

broadcaster.on("hosted", function(channel, username, viewers){
    events.hosted(channel, username, viewers);
});


radelf.on("newFollow", function(follower){
    events.newFollow(follower);
})

setInterval(timers.quote, 1000 * 60 * 29);
setInterval(timers.rules, 1000 * 60 * 30);
setInterval(radelfFunctions.savePoints, 1000 * 60 * 10);
setInterval(timers.giveall, 1000 * 60 * 5);
setInterval(timers.isLive, 1000 * 60 *3);