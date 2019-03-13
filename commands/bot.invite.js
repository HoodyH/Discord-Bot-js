const command_name = "bot.invite";
const Discord = require("discord.js");
const botconfig = require("../bot_config_json/botconfig.json");

module.exports.run = async (bot, message, args) => {
    let bot_icon = bot.user.displayAvatarURL;
    let bot_invite_embed = new Discord.RichEmbed()
    .setTitle("Hey hey hey, Click here to invite me")
    .setURL(botconfig.main_join_link)
    .setDescription("Ready to have some fun?")
    .setColor(botconfig.white)
    .setThumbnail(bot_icon)
    .setTimestamp(new Date())
    .setFooter("©" + bot.user.username)

    message.channel.send(bot_invite_embed);
}

module.exports.help = {
  name: command_name
}