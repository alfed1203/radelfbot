const _ = require("lodash");
const tmi = require("tmi.js");
const secrets = require("./config/secrets");

var radelf = new tmi.client(
    _.defaults({
        identity: secrets.radelfbot,
        channels: ["alfred1203"]
    },  require ("./config/config"))
);

radelf.broadcasterID = "#";

module.exports = radelf;