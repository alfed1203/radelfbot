const _ = require("lodash");
const tmi = require("tmi.js");
const secrets = require("./config/secrets");

const broadcaster = new tmi.client(
    _.defaults({
        identity: secrets.broadcaster
    },  require ("./config/config")));

module.exports = broadcaster;