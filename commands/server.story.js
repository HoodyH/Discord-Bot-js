const command_name = "server.story";
const Discord = require("discord.js");

const botconfig = require("../bot_config_json/botconfig.json");

module.exports.run = async (bot, message, args) => {

  message.delete().catch(console.error);

  notifications.betaCommand(message, command_name, "1.0");

  let g = message.guild;

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
                    "I'm sure you wanna know more, well we have grown an awerage of **" + grown_rate + " people per day**, wow!\n";

  let usr_online = 0;
  let usr_idle = 0;
  let usr_dnd = 0;
  let usr_offline = 0;
  let usr_invisible = 0;
  
  let non_plaing = 0;

  function countPresences(guild_member, SnowFlake, key, map) {
    switch(guild_member.presence.status){
      case "online": usr_online++; break;
      case "idle": usr_idle++; break;
      case "dnd": usr_dnd++; break;
      case "offline": usr_offline++; break;
    }
    if(guild_member.presence.status == "invisible"){usr_invisible++;}
    if(guild_member.presence.status != "offline" && guild_member.presence.game == null){non_plaing++;}
  }

  g.members.forEach(countPresences);

  description +=    "There are **" + usr_online + " people Online**";
  if(usr_idle != 0){
    description +=  ", **" + usr_idle + " people idle**";
  } 
  if(usr_dnd != 0){
    description +=  ", and even **" + usr_dnd + " people with Do not disturb on**, hahaha *shh they are doing importants stuffs* lmao";
  } 
  description +=    ".\n";
  if(usr_invisible != 0){
    description +=  "Oooh i can smell **" + usr_invisible + " invisibe users** wanna know who they are? :3" +
                    " well there is a command for that but only Admins can use it. xD \n";
  }
  let all_on = usr_online + usr_idle + usr_dnd + usr_invisible;
  if(all_on - non_plaing == 0){
    description +=  "Currently **nobody is playing**, wut what are you doing guys?!\n"
  }else{
    description +=  "Currently there are **" + all_on - non_plaing + " playing people** and " + non_plaing + " non playing, wut what are you doing guys?!\n"
  }
  if(g.verified == true){
    description +=  "This is also a **verified** server ";
  }else{
    description +=  "Unfortunately this is a **unverified** server (but I'm sure it will be soon) ";
  }
  description +=    "placed in the pacefull **" + g.region + "** land."
  
  //get Emoji
  const emoji_list = message.guild.emojis.map(e=>e.toString()).join(" ");

  //get roles
  let role_list = "";
  let role_count = 0;
  let member_role_count;

  function countPeople(guild_member, SnowFlake, key, map) {
    member_role_count++;
  }
  function countRoles(role, SnowFlake, key, map) {
    role_count++;
    member_role_count = 0;
    role.members.forEach(countPeople);
    role_list += "**" + role.name + "**: assigned to **" + member_role_count + " people**\n";
  }
  g.roles.forEach(countRoles);
    
  let serverembed = new Discord.RichEmbed()
  .setAuthor(g.name, g.iconURL)
  .setColor(botconfig.yellow)
  .setThumbnail(g.iconURL)
  .setTitle(title)
  .setDescription(description)
  .addField("Emoji on the server:", emoji_list)
  .addField("List of Roles:", role_list);

  message.channel.send(serverembed).then(m => m.delete(botconfig.time_auto_delete_post));
}

module.exports.help = {
  name: command_name
}
