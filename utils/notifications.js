const Discord = require("discord.js");
const fs = require("fs");

//utilities
const botconfig = require("../bot_config/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");

module.exports.genericNotification = (message, notification) => {
    
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor(botconfig.green)
        .setTitle(notification);

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.activated = (message, command_name) => {
    let embed = new Discord.RichEmbed()
        .setTitle(command_name + " **Ativated**")
        .setColor(botconfig.green)

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.deactivated = (message, command_name) => {
    let embed = new Discord.RichEmbed()
        .setTitle(command_name + " **Detivated**")
        .setColor(botconfig.green)

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.toInit = (message, command_name) => {

    const prefix = require("../storage/prefixes");
    let p = prefix[message.guild.id].prefix;
    let output;
    if(permits.configurator(message)){
        output = "You have to **init** the channel, use " + p + command_name + " init";
    }else{
        output = "The command has not been initialized yet";
    }

    let embed = new Discord.RichEmbed()
        .setTitle("Command not initialized")
        .setDescription(output)
        .setColor(botconfig.yellow)

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_output));
}

module.exports.initDone = (message) => {

    const prefix = require("../storage/prefixes");
    let p = prefix[message.guild.id].prefix;

    let embed = new Discord.RichEmbed()
        .setTitle("Inizialization Completed")
        .setDescription("now you can use the command")
        .setColor(botconfig.green)
        .addField("For **keep this chat cleen** of text use ", p + "keep.deleted")

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_output));
}

module.exports.betaCommand = (message, command_name, version) => {

    let embed = new Discord.RichEmbed()
        .setTitle("This Module is still in **Besta**")
        .setDescription("Name: " + command_name + "\nVersion: " + version)
        .setColor(botconfig.yellow)

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_output));
}

module.exports.fastManual = (message, command_name, manual) => {

    const prefix = require("../storage/prefixes");
    let p = prefix[message.guild.id].prefix;

    let embed = new Discord.RichEmbed()
        .setTitle("How to use **" + p + command_name + "** command")
        .setDescription(manual)
        .setColor(botconfig.white)

    return message.channel.send(embed);
}

