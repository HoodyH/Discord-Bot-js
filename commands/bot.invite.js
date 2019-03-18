const command_name = "bot.invite";

const Discord = require("discord.js");

const botconfig = require("../bot_config/botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete().catch(console.error);

    let embed_out = new Discord.RichEmbed()
    .setTitle("Hey hey hey, Click here to invite me")
    .setURL(botconfig.main_join_link)
    .setDescription("Ready to have some fun?")
    .setColor(botconfig.white)
    .setThumbnail(bot.user.displayAvatarURL)

    message.channel.send(embed_out);
}

module.exports.help = {
  name: command_name
}