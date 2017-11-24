const radelf = require("../radelf-client");

const _ = require("../utils");

const queue = require("../message-queue");

const clearance = require("./clearance");


const raid = { 
    raiding: false,

    team: [],

    teamVerified: [],

    commands: {
        "raidready": clearance.viewer((channel, userstate) => {
            const name = _.getUsername(userstate);

            if(raid.raiding) {
                if(!raid.team.includes(userstate.username)) {
                    raid.team.push(userstate.username);
                    queue.addMessage(channel, name + " is ready to raid!");
                } else {
                    queue.addMessage(channel, name + ", you have already joined the raid team.");
                }
            } else {
                queue.addMessage(channel, name + ", we are not raiding yet.");
            }
        }), 

        "raidteam": clearance.moderator((channel) => {
            if(raid.raiding) {
                queue.addMessage(channel, raid.team.length + " teammates are prepared to raid! Use !raidready to join the raid team!");
            } else {
                queue.addMessage(channel, "No active raid team.");
            }
        }),
        "raidstart": clearance.broadcaster((channel) => {
            if(!raid.raiding){
                raid.raiding = true;
                raid.team = [];
                raid.teamVerified = [];
                queue.addMessage(channel, "The ALFRED RAID IS ABOUT TO BEGIN!!! We have started a raid team. Use !raidready to join!");
            } else {
                queue.addMessage(channel, "Use !raidready to join");
            }
        }),
    }
};

radelf.on("message", (channel, userstate, message, self) => {
    if(self) return;

    if(userstate["message-type"] != "chat" && userstate["message-type"] != "action") return;

    if(raid.raiding && channel != beastie.getChannels()[0]){
        if(raid.team.includes(userstate.username) && !raid.teamVerified.includes(userstate.username)){
            raid.teamVerified.push(userstate.username);
        }
    }
});

radelf.on("hosting", (channel, target, viewers) => {
    if(!raid.raiding) return;

    if(channel != radelf.getChannels()[0]) return;

    radelf.join(target);
    radelf.say(channel, "Time to raid! :D rawr");

    setTimeout(() => {
        if(!raid.raiding) return;

        radelf.part(target);
        radelf.say(channel, "Great raid team! :D");

        _.logger("info", "[raid] raid complete -- " + raid.teamVerified.length + " of " + raid.team.length);
        _.giveAllPoints(raid.teamVerified.length);
        raid.team = [];
        raid.teamVerified = [];
        raid.raiding = false;
    }, 1000 * 60 * 2); 
});

module.exports = raid;