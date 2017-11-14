const radelfFunctions = require("../radelf-functions");
const queue = require("../message-queue");
const points = require("../misc/points");
const discord = require("discord.js");
const misc = require("../misc/misc");

const radelf = require("../radelf-client");
const radelfdiscord = require("../radelfdiscord-client");

const quotes = require("../misc/quotes");

module.exports.quote = function(){
        if(islive){
            queue.addMessage(radelf.getChannels()[0], "Remember that time Alfred said, \"" + radelfFunctions.getArrayElement(quotes) + "\" <3");
        }
}

module.exports.rules = function(){
        if(islive){
            queue.addMessage(radelf.getChannels()[0], "THE RULES GO HERE. rawr");
        }
}

module.exports.giveall = function(){
    if(!islive)return;
    var amount = 1;
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
    console.log("[%s] [twitch] info: everyone got 1 point", radelfFunctions.formatDate(new Date()));
        
}


module.exports.isLive = function(){    
    if (typeof islive === 'undefined'){islive = false;};
    radelf.api(radelfFunctions.queryTwitchAPI(
        "streams/" + radelf.broadcasterID
    ), function(err, res, body) {
        if(!err && body.stream != null && islive == false){
            islive = true;
            var channel = radelfdiscord.channels.find("name", "news");
            if(!channel)return;
            channel.send("@everyone alfred1203 is live. Watch their stream here: \n https://www.twitch.tv/alfred1203");
        }
        if(body.stream == null && islive == true){
            islive = false;
        }
    }
    )
}
