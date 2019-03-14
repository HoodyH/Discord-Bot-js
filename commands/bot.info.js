const command_name = "bot.info";
const Discord = require("discord.js");

const botconfig = require("../bot_config_json/botconfig.json");

module.exports.run = async (bot, message, args) => {

  message.delete().catch(console.error);

  let g = message.guild;

  var resMsg = await message.channel.send('Ping calcutale..');
    //.then(m => m.delete(1000));
  
  resMsg.edit('Ping: ' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - bot.ping));
  message.channel.send(bot.ping);

  var createdAt = g.createdAt
            .toString()
            .slice(4,33)
            .replace(/ /g,"_")
            .replace(/:/g,"_")
            .replace(/\+/g,"_");

  let bicon = bot.user.displayAvatarURL;
  let botembed = new Discord.RichEmbed()
  .setDescription("Bot Information")
  .setColor("#15f153")
  .setThumbnail(bicon)
  .addField("Bot Name", bot.user.username)
  .addField("Created On", bot.user.createdAt);

  message.channel.send(botembed).then(m => m.delete(botconfig.time_auto_delete_info));
}

module.exports.help = {
  name: command_name
}
