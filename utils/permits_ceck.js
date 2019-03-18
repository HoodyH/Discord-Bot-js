const Discord = require("discord.js");

//utilities
const botconfig = require("../bot_config/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");

module.exports.hasAdministrator = (message) => {

    if(message.member.admin("ADMINISTRATOR")){
        return true;
    }
    return false;
}

module.exports.configurator = (message) => {

    if( message.member.hasPermission("ADMINISTRATOR") ||
        message.member.hasPermission("MANAGE_MESSAGES") ||
        message.member.hasPermission("MANAGE_CHANNELS") ||
        message.member.hasPermission("MANAGE_GUILD") ){
        return true;
    }
    return false;

}