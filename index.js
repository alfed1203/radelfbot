const _ = require("./utils")
const queue = require("./message-queue");
const tmi = require("tmi.js");
const Discord = require("discord.js")
const events = require("./events/events");
const followers = require("./events/followers");
const timers = require("./timers/timers");
const broadcaster = require("./broadcaster-client");
const radelf = require("./radelf-client");
const radelfDiscord = require("./radelfdiscord-client");

radelf.connect();
broadcaster.connect();
radelfDiscord.login(require("./config/secrets").discord.token);

/****************TWITCH*********************/
radelf.on("message",(channel, userstate, message, self)=>{ events.ttmessage(channel, userstate, message, self)});
radelf.on("join",(channel, username, self)=>{events.join(channel, username, self)});
radelf.on("part", (channel, username, self) =>{events.parts(channel, username, self)})
radelf.on("ban", (channel, username)=>{events.banned()});
radelf.on("newFollow", (follower)=>{events.newFollow(follower)});
broadcaster.on("hosted", (channel, username, viewers)=>{events.hosted(channel, username, viewers)});
/****************DISCORD*********************/
radelfDiscord.on('message', message=>{events.dismessage(message);});
radelfDiscord.on('guildMemberAdd' , member=>{events.newMember(member)});
radelfDiscord.on('ready', () =>{events.disready()});
radelfDiscord.on("disconnect", (events)=>{_.logger("error", "discord disconnected " + events)});
radelfDiscord.on("reconnecting",()=>{_.logger("error", "discord trying to reconnect")});
radelfDiscord.on("error", (err)=>{_.logger("error", err)});
/****************PROCESS*********************/
process.on("unhandledRejection", (rejection)=>{_.logger("debug", `${rejection}`)});
process.on("SIGINT", ()=>{events.part()});
process.on("SIGBREAK", ()=>{events.listen()});