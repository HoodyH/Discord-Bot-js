const command_name = "server.info";
const Discord = require("discord.js");

const botconfig = require("../bot_config_json/botconfig.json");

module.exports.run = async (bot, message, args) => {
    
  let g = message.guild;

  if(!g.avaiable){
    return;
  }
  //createdAt
  //emojis
  //memberCount  presence (online members)
  //owner
  //region
  //roles
  //verified

    var resMsg = await message.channel.send('Ping calcutale..');
      //.then(m => m.delete(1000));
    
    resMsg.edit('Ping: ' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - bot.ping));
    message.channel.send(bot.ping);
    
    
    let serverembed = new Discord.RichEmbed()
    .setAuthor(g.name, g.iconURL)
    .setTitle(`Welcome in ${g.name} server`)
    .setDescription("Best server ever created! For sure!")
    .setColor(botconfig.yellow)
    .setThumbnail(g.iconURL)
    .addField("Created On", message.guild.createdAt)
    .addField("You Joined", message.member.joinedAt)
    .addField("Total Members", message.guild.memberCount);

    message.channel.send(serverembed).then(m => m.delete(botconfig.time_auto_delete_info));
}

module.exports.help = {
  name: command_name
}
