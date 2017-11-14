
var radelf = require("./radelf-client");

var messageQueue = [];

module.exports.addMessage = function(channel, message){
    messageQueue.push(() => radelf.say(channel, message));
}

module.exports.addWhisper = function(username, message){
    messageQueue.push(() => radelf.whisper(username, message));
}

module.exports.flushQueue = function(channel, message){
    messageQueue = [() => radelf.say(channel, message)];
}


radelf.once("join", function(){
    setInterval(function(){
        if(messageQueue.length > 0){
            messageQueue.shift()();
        }
    }, radelf.isMod("#alfred1203", radelf.getUsername()) ? 500 : 2000); // .5sec timer
})