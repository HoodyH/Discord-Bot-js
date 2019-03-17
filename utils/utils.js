const Discord = require("discord.js");

//utilities
const botconfig = require("../bot_config_json/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");
const utils = require("../utils/utils.js");

//external_libs
const fse = require("fs-extra");

module.exports.preCeck = (bot, message, args, command_name, file_dir_command, db_command_obj, db_config_obj) => {
    //default arguments "init" "info"
    //auto_prececk  "message" "DB_FILE" "DB_CONFIG" 
    //THINGS TO CECK "enabled" "only admin" "channel vincolation"
    const g_log = db_command_obj["guild_data"];

    //recicived a init request, ceck permissions before go
    if(args == "init" && g_log.lock_in_channel_en == 1)
    {
      if(permits.configurator(message))
      {
        g_log.channel_id = message.channel.id;
        g_log.channel_name = message.channel.name;
        utils.jsonLogSave(file_dir_command, db_command_obj);

        notifications.initDone(message);
        return false;  

      //this user cant init cause not enought permissions
      }else{ 
        errors.noPermits(message, "configurator")
        return false;
      }
    }

    //ceck if you are in the correct channel
    if(g_log.channel_id != "ND" && g_log.lock_in_channel_en == 1 && message.channel.id != g_log.channel_id)
    {
      errors.wrongChannel(message, g_log.channel_name);
      return false;
    }

    //init required, the command dont have a channel assigned
    if(g_log.lock_in_channel_en == 1 && g_log.channel_id == "ND")
    {
      notifications.toInit(message, command_name);
      return false;
    }

    return true;
}

module.exports.jsonLogName = (message, file_name) => { //oper or create file in storage/guildID

    const storage_location = "./storage";
    const guild_id = message.guild.id;
    const dir = `${storage_location}/${guild_id}`; //song_request.json
    return `${dir}/${file_name}.json`;
}

module.exports.jsonLogOpen = (file_dir) => { //oper or create file in storage/guildID

    let obj;

    try {
        obj = require("."+file_dir);
    } catch (err) {
        if (err.code == 'MODULE_NOT_FOUND') {
            fse.outputFileSync(file_dir, "{}");
            obj = require("."+file_dir);
        }
    }

    return obj;
}

module.exports.jsonLogSave = (file_dir, obj) => { //oper or create file in storage/guildID

    fse.outputFileSync(file_dir, JSON.stringify(obj, null, 4));   
}

module.exports.jsonCreateGuilConfig = (file_dir, obj) => { //create a new file guild config

}

module.exports.secondsToTime = (sec) => {

    var days = Math.floor(sec / (3600*24));
    var hrs = Math.floor((sec - (days * (3600*24))) / 3600);
    var min = Math.floor((sec - (days * (3600*24)) - (hrs * 3600)) / 60);
    var seconds = sec - (days * (3600*24)) - (hrs * 3600) - (min * 60);
    seconds = Math.round(seconds * 100) / 100
    
    var result = (days != 0 ? days + "d " : "");
    result += (hrs != 0 || days != 0  ? hrs + "h " : ""); //(hrs < 10 ? "0" + hrs : hrs)
    result += (min != 0 || hrs != 0 || days != 0 ? min + "m " : ""); //(min < 10 ? "0" + min : min)
    result += seconds + "s"; //(seconds < 10 ? "0" + seconds : seconds)
    return result;  
}

module.exports.dataDiff = (date_now, date_1) => {
   return (date_now - new Date(date_1.toString())) / (1000*60*60*24);
}