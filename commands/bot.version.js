const command_name = "bot.version";

const Discord = require("discord.js");

const botconfig = require("../bot_config_json/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");

module.exports.run = async (bot, message, args) => {

  message.delete().catch(console.error);

  let embed_out = new Discord.RichEmbed()
    .setTitle("Bot Actual Release Informations")
    .setDescription("Actual Version **" + botconfig.release_version + "**\n" +
                    "Release Date **" + botconfig.last_release_date + "**")
    .setColor(botconfig.white)
    .setThumbnail(bot.user.displayAvatarURL)

  message.channel.send(embed_out).then(m => m.delete(botconfig.time_auto_delete_output));
}

module.exports.help = {
  name: command_name
}