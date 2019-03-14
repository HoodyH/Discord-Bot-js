const command_name = "server.story";
const Discord = require("discord.js");

const botconfig = require("../bot_config_json/botconfig.json");

module.exports.run = async (bot, message, args) => {

  message.delete().catch(console.error);

  let g = message.guild;
  //createdAt
  //emojis
  //memberCount  presence (online members)
  //owner
  //region
  //roles
  //verified
  //``
  let title = "Wanna know some **cool stufs** about this server?";

  let creation_date = g.createdAt.toString().slice(4,15);
  let creation_time = g.createdAt.toString().slice(16,24);

  let description = "To begin this is best server ever created! For sure!\n" +
                    "It was created in the far away **" + creation_date + "** precisely at **" + creation_time + "** of a sunny day (maybe).\n" +
                    "From a really really cool person knowed as **" + g.owner.displayName+ "**";
  if(g.owner.nickname != null){
    description +=  " also called **" + g.owner.nickname +"**.\n";
  }else{
    description +=  ".\n";
  }

  function dateDiffInDays(a, b) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  let grown_rate = (g.memberCount / dateDiffInDays(new Date(g.createdAt.toString()), new Date())).toString().slice(0,5);

  description +=    "And now we are here having fun all **" + g.memberCount + " of us**, thats are a lot, right?!\n" +
                    "I'm sure you wanna know more, well we have grown an awerage of **" + grown_rate + " ppl per day**, wow!\n";
  
  
  description +=    "Currently there are";
  if(g.verified == true){
    description +=  "This is also a **verified** server ";
  }else{
    description +=  "Unfortunately this i a **unverified** server, but I'm sure it will be soon ";
  }
  description +=    "placed in the pacefull **" + g.region + "** land."
  //g.roles + g.presence;
  
  let serverembed = new Discord.RichEmbed()
  .setAuthor(g.name, g.iconURL)
  .setColor(botconfig.yellow)
  .setThumbnail(g.iconURL)
  .setTitle(title)
  .setDescription(description)
  .addField("Emoji on the server:", g.emojis)
  .addField("Total Members", message.guild.memberCount);

  message.channel.send(serverembed).then(m => m.delete(botconfig.time_auto_delete_info));
}

module.exports.help = {
  name: command_name
}
