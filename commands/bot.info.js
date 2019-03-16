const command_name = "bot.info";
const Discord = require("discord.js");

const botconfig = require("../bot_config_json/botconfig.json");

module.exports.run = async (bot, message, args) => {

  message.delete().catch(console.error);

  let g = message.guild;

  var resMsg = await message.channel.send('Ping calcutale..');
  
  let reactivity = Math.round((resMsg.createdTimestamp - message.createdTimestamp) - bot.ping);
  
  resMsg.delete(200);

  let creation_date = g.createdAt.toString().slice(4,15);
  let creation_time = g.createdAt.toString().slice(16,24);
  let description = "My name is: **" + bot.user.username + "** (mlgnlllrfekjhadrg), i was born on **" +
                    creation_date + " at " + creation_time + "** ,nice."

  let embed_out = new Discord.RichEmbed()
  .setTitle("Bot Information")
  .setColor(botconfig.white)
  .setThumbnail(bot.user.displayAvatarURL)
  .setDescription(description)
  .addField("Ping", bot.ping + " ms", true)
  .addField("Reactivity", reactivity + " ms", true);

  message.channel.send(embed_out).then(m => m.delete(botconfig.time_auto_delete_output));
}

module.exports.help = {
  name: command_name
}
