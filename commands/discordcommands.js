const Discord = require("discord.js");
const radelfdiscord = require("../radelfdiscord-client");
const radelfFunctions = require("../radelf-functions");
const _ = require("lodash");
const songs = require("../misc/song");
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

const commands = {
    "ping":     function(message){
        message.channel.send("pong " + radelfdiscord.ping + "ms");
    },
    "help":     function(message){
                var cmds = _.keys(commands).filter( function(cmd){
                    return true;
                }).map( function(cmd){
                    return "!" + cmd;
                });
        msg = "Here are some of my tricks: " + cmds.join(", ") + ". rawr";
        message.channel.send(msg);
    }, 
    "nsfw":     function(message){
                   var nsfw = message.guild.roles.find("name", "nsfw").id;
                    var user = message.member;
                    user.addRole(nsfw);
                    console.log("[%s] [discord] info: %s has been added to the nsfw channel", radelfFunctions.formatDate(new Date()), message.author.username);
                    
    },
    "avatar":   function(message){
                message.channel.send(message.author.avatar);
    },
    "join":     function(message){
                    if (message.member.voiceChannel) {
                        message.member.voiceChannel.join()
                        .then(connection => {
                            connected = connection;
                            message.channel.send('I have successfully connected to the channel!');
                            if(songs.songs[0] != undefined){
                                var url = songs.songs.shift();
                                message.channel.send("now playing: " + url)
                                var stream = ytdl(url, {format: "mp3"});
                                dispatcher = connection.playStream(stream, streamOptions);

                            } else {
                                var url = radelfFunctions.getArrayElement(songs.favs);
                                message.channel.send("now playing: " + url)
                                var stream = ytdl(url, { format: "mp3"});
                                dispatcher = connection.playStream(stream, streamOptions);
                            }
                            dispatcher.on('end', () => {
                                console.log("ended");
                                if(songs.songs[0] != undefined){
                                    var url = songs.songs.shift();
                                    message.channel.send("now playing: " + url)
                                    var stream = ytdl(url, { format: "mp3"});
                                    dispatcher = connection.playStream(stream, streamOptions);
                                } else {
                                    var url = radelfFunctions.getArrayElement(songs.favs);
                                    message.channel.send("now playing: " + url)
                                    var stream = ytdl(url, { format: "mp3"});
                                    dispatcher = connection.playStream(stream, streamOptions);
                                }
                            });
                            dispatcher.on('error', e => {
                                console.log(e);
                            })
                        })
                        .catch(console.log);
                    } else {
                        message.channel.send('You need to join a voice channel first!');
                    }
                },
    "play":     function(message){
                    var url = message.content.slice("!play ".length);
                    if(url == undefined)return;
                    songs.songs.push(url);
                },
    "pause":    function(message){
                    dispatcher.pause();
                }, 
    "resume":   function(message){
                    dispatcher.resume();
                },
    "end":       function(message){
                    dispatcher.end();
    },
    "volume":   function(message){
                    var volume = message.content.slice("!volume ".length);
                    dispatcher.setVolume(volume);
                },
    "leave":    function(message){
                    connected.disconnect();
    }
}

module.exports = commands;
