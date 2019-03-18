const Discord = require("discord.js");
const botconfig = require("../bot_config/botconfig.json");

module.exports.genericError = (message, error) => {
    
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor(botconfig.red)
        .setTitle(error);

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.noChatHere = (message) => {
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor(botconfig.red)
        .setTitle("You can't chat here")
        .setDescription("this channel is not meant for this");

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.noPermits = (message, perm) => {
    const prefix = require("../storage/prefixes");
    let p = prefix[message.guild.id].prefix;

    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setTitle("Insufficient Permissions")
        .setColor(botconfig.red)
        .addField(`You need: **${perm}** permit`, `use ${p}help.permits to learn more`);

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.wrongChannel = (message, channel) => {
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor(botconfig.red)
        .setTitle("Wrong channel for this command")
        .setDescription("go in **#" + channel + "**");

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.equalPerms = (message, user, perms) => {

    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor(botconfig.red)
        .setTitle("Error")
        .addField(`${user} has perms`, perms);

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));

}

module.exports.botuser = (message) => {
    let embed = new Discord.RichEmbed()
        .setTitle("Error")
        .setDescription("You cannot ban a bot.")
        .setColor(botconfig.red);

    message.channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.cantfindUser = (channel) => {
    let embed = new Discord.RichEmbed()
        .setTitle("Error")
        .setDescription("Could not find that user.")
        .setColor(botconfig.red);

    channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}

module.exports.noReason = (channel) => {
    let embed = new Discord.RichEmbed()
        .setTitle("Error")
        .setDescription("Please supply a reason.")
        .setColor(botconfig.red);

    channel.send(embed).then(m => m.delete(botconfig.time_auto_delete_fast));
}
