
setTimeout(() => {
        const commands = require("../commands/commands");
        var cmds = Object.keys(commands).filter(function(cmd){
            if(commands[cmd].restricted) return false;
                return true;
            }).map( function(cmd){
                return "!" + cmd;
            });
            helpcmd.undefined = "Here are some of my tricks: " + cmds.join(", ") + "."
                   
            var modcmds = Object.keys(commands).filter(function(modcmd){
                if(commands[modcmd].restricted && commands[modcmd].mod) return true;
            }).map( function(modcmd){
                return "!" + modcmd;
            });
            helpcmd["modcmd"] =  "Here are my mod commands: " + modcmds.join(", ") + "."
            
}, 500);

var helpcmd = {
    "goodbye": "!goodbye: Tells you goodbye.",
    "hello": "!hello: Tells you hello.",
    "help": "!help: Says the list of commands; !help [command]: Says info about the command.",
    "pet": "!pet: Pets radelf.",
    "rawr": "!rawr: Makes radelf rawr.",
    "uptime": "!uptime: Gives how long alfred1203 is live.",
    "addquote": "!addquote [quote]: adds a quote to the quotes list; cost = 50 points.",
    "points": "!points: Tells you how much points you have.",
    "top5": "!top5: Says the top 5 users of points in order.",
    "givemine": "!givemine [target] [amount]: gives target an indicated amount of your points.",
    "songrequest": "!songrequest [url]: add song to the queue(youtube links only); cost = 15 points.",
    "github": "!github: Gives you the github link.",
    "gitlab": "!gitlab: Gives you the gitlab link.",
    "discord": "!discord: Gives you the discord invite link!",
    "vote": "!vote [index]: vote for the current poll; First vote is free, every vote after the first cost 10 points.",
    "poll": "!poll : Gives the options to the open poll;",
    "join": "!join :join the current giveaway; first ticket is free,each after the first cost 50 points."
}

module.exports = helpcmd;


