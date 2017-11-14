const queue = require("../message-queue");
const discord = require("discord.js");
const radelf = require("../radelf-client");
const radelfFunctions = require("../radelf-functions");
const misc = require("../misc/misc");

const radelfdiscord = require("../radelfdiscord-client");

module.exports.join = function(channel, username, self){
    if(self){
        if(channel != radelf.getChannels()[0]) return;
        
        if(channel == "#alfred1203"){
            queue.addMessage( channel, "Hello Team! :D I have awoken! Welcome back to the alfred1203 channel!");
        } else{
            queue.addMessage( channel, "Hello everybody! :D I have awoken! Welcome back to " + channel.slice(1) + "'s channel!");
        }

    } 
    if(!misc.chatters.includes(username)){misc.chatters.push(username)};
};

module.exports.parts = function(channel, username, self){
    var index = misc.chatters.indexOf(username);
    misc.chatters.splice(index,1);
}

module.exports.part = function(){
    for( var hoster = 0; hoster < host.ourHosts.length; hoster++ ){
            radelf.say( radelf.getChannels()[0], "Thank you for hosting our stream to " + host.ourHosts[hoster][1] + " today " + host.ourHosts[hoster][0] + "! Check out our friend: twitch.tv/" + host.ourHosts[hoster][0]);
    }
    
    var channel = radelfdiscord.channels.find("name", "bot");
    channel.send("Goodbye Team! I'm going to sleep.");

    radelfFunctions.savePoints();

    radelfFunctions.saveQuotes();

    setTimeout(function(){
        
        if(radelf.getChannels()[0] == "#alfred1203"){
            radelf.say( radelf.getChannels()[0], "Goodbye Team! I'm going to sleep.");
        } else {
            radelf.say( radelf.getChannels()[0], "Goodbye Everyone! I'm going to sleep.");
        }
        process.exit();
    }, 500 * host.ourHosts.length + 1000); // 1sec OR TRY .5secs * number of hosters + 1 = (500 * host.ourHosts.length + 1)
};

module.exports.hosted = function(channel, username, viewers){
    if(viewers >= 3){
        queue.addMessage(channel, username + " has hosted us to " + viewers + " viewers! Thank you ʕ•ᴥ•ʔ rawr!! Let's go check out their awesome channel: twitch.tv/" + username + "!");
        misc.ourHosts.push([username, viewers]);
        console.log(misc.ourHosts);
    }
};

module.exports.newFollow = function(follower){
    console.log("We have a new follower! " + follower);
    radelfFunctions.giveAllPoints(10);
    radelf.say(radelf.getChannels()[0], "Welcome to the team " + follower + "! :D");
};