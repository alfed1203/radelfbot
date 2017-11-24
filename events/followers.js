const radelf = require("../radelf-client");
const _ = require("../utils");
const secrets = require("../config/secrets");

var newFollows = [];

var latestFollow = "#";

setInterval(function(){

    if(radelf.broadcasterID == "#"){
        _.logger("info","radelf's broadcasterID is: " + radelf.broadcasterID);
        radelf.api(_.queryTwitchAPI(
            "users?login=alfred1203"
        ), function(err, res, body){
            radelf.broadcasterID = body.users[0]._id;
            _.logger("info","This is our channel id: " + radelf.broadcasterID);
            checkFollows(radelf.broadcasterID);
        });
    } else {
        checkFollows(radelf.broadcasterID);
    }
    
    if (newFollows.length > 0) radelf.emit("newFollow", newFollows.shift());
}, 1000 * 10); // 1sec * 10 = 10sec timer

function checkFollows(id){
    let newFollowsHold = [];
    
    radelf.api(_.queryTwitchAPI(
        "channels/" + id + "/follows/"
    ), function(err, res, body) {
        if(err || body.follows == null || "error" in body) {
            _.logger("error","There was a problem querying the Twitch API for follows:");
            _.logger("error",err);
            
            _.logger("warn", "There was no follows array returned in the Twitch API response.");
            if(body.error) _.logger("error",body.error + ": " + body.message);
            return;
        } else{
            if (latestFollow == "#") {
                latestFollow = body.follows[0].user.display_name;
            } else {
                for( let i = 0; i < body.follows.length; i++){
                    if(body.follows[i].user.display_name != latestFollow){
                        newFollowsHold.push(body.follows[i].user.display_name);
                    } else{
                        latestFollow = body.follows[0].user.display_name;
                        newFollows = newFollows.concat(newFollowsHold);
                        break;
                    }
                }
                latestFollow = body.follows[0].user.display_name;
            }
        }
    });    
}
