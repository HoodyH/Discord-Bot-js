//command_name
const command_name = "keep.deleted";

const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");
const utils = require("../utils/utils.js");

const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    
  message.delete().catch(console.error);

  if(!permits.configurator(message)){
    errors.noPermits(message, "Configurator");
    return;
  }
    
    /*
      command_name <arg> <arg> ....
          possibiles args
            man -> explain the scope and the use of this command in an embed
            init -> if neded init the command (enable the command and lock him to che channel)
            !message_type
          
      channel_id {
          commands_allowed []
          message_type []
      }
    */
  let file_dir = utils.jsonLogName(message, "guild_config");
  let json_file = utils.jsonLogOpen(file_dir);

  if(!json_file["channel_keep_deleted"])
  {
    json_file["channel_keep_deleted"] = {
      channels: []
    }
  }
  
  let channels = json_file["channel_keep_deleted"].channels;
  let array = channels.slice(0);
  
  if(!array.includes(message.channel.id)) {
    array.push(message.channel.id);
    notifications.activated(message, command_name);
  }else{
    for(let i = 0; i < array.length; i++){ 
      if ( array[i] === message.channel.id) {
        array.splice(i, 1); 
      }
    }
    notifications.deactivated(message, command_name);
  }

  json_file["channel_keep_deleted"].channels = array;

  utils.jsonLogSave(file_dir, json_file);
}

module.exports.help = {
  name: command_name
}