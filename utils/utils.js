const Discord = require("discord.js");

//utilities
const botconfig = require("../bot_config/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");
const utils = require("../utils/utils.js");

//external_libs
const fse = require("fs-extra");

module.exports.preCeck = async (bot, message, args, file_dir, db_obj, specific_com_obj, db_config_obj) => {
    //default arguments "init" "info"
    //auto_prececk  "message" "DB_FILE" "DB_CONFIG" 
    //THINGS TO CECK "enabled" "only admin" "channel vincolation"
    const g_log = db_obj["guild_data"];

    //recicived a init request, ceck permissions before go
    if(args == "init" && g_log.lock_in_channel_en == 1)
    {
      if(permits.configurator(message))
      {
        notifications.initDone(message);
        g_log.last_man_message_id = await utils.manAsLastMessage(bot, message, db_obj, specific_com_obj);
        g_log.channel_id = message.channel.id;
        g_log.channel_name = message.channel.name;
        utils.jsonLogSave(file_dir, db_obj);
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
      notifications.toInit(message, specific_com_obj.name);
      return false;
    }

    if(args == "man"){
      g_log.last_man_message_id = await utils.manAsLastMessage(bot, message, db_obj, specific_com_obj);
      utils.jsonLogSave(file_dir, db_obj);
      return false;
    }

    return true;
}


module.exports.manAsLastMessage = async (bot, message, db_obj, specific_com_obj) => {
  
    const g_log = db_obj["guild_data"];

    async function del (){
      try {
        let channel = bot.channels.get(g_log.channel_id);
        let lastMex = await channel.fetchMessage(g_log.last_man_message_id)
        lastMex.delete();
      } catch (err) {
        console.log("error deleting message in manAsLastMessage function");
      }
    }

    if(g_log.man_as_last_message == 1)
    {
        if(g_log.last_man_message_id != ""){
          del();
        }
        let newMex = await notifications.fastManual(message, specific_com_obj.man, specific_com_obj.name);
        return newMex.id;

    }else if(g_log.last_man_message_id != ""){
      del();
      return "";
    }
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

module.exports.dataToDay = (data) => {
  return data.toString().slice(0,10);
}
module.exports.dataToTime = (data) => {
  return data.toString().slice(11,16);
}
module.exports.DayAtTime = (data) => {
  console.log(utils.dataToDay(data) + " at " + utils.dataToTime(data));
  return utils.dataToDay(data) + " at " + utils.dataToTime(data);  
}

module.exports.dataDiff = (date_now, date_1, resut_time_type, result_elab) => {
  let div;
  switch(resut_time_type){
    case "d": div = 1000*60*60*24;break; //days
    case "h": div = 1000*60*60;break; //hours
    case "m": div = 1000*60;break; //min
    case "s": div = 1000;break; //sec
    default: div = 1000*60*60*24; //default in days
  }
  switch(result_elab){
    case "ceil": return Math.ceil((date_now - new Date(date_1)) / div);
    case "floor": return Math.floor((date_now - new Date(date_1)) / div);
    case "round": return Math.round((date_now - new Date(date_1)) / div);
    default: return (date_now - new Date(date_1)) / div;
  }
  
}

module.exports.roleReward = (db_obj, actual_progress) => {
  const db = db_obj["guild_data"];
  let num;
  let color;
  let name;
  for(let i = db.role_at.length()-1; i >= 0; i--){
    if(actual_progress >= db.role_at[i]){
      num = i + 1;
      color = db.role_color[i];
      name = db.role_name[i];
      break;
    }
  }

  const out = {
    num: num,
    color: color,
    name: name
  }
  return out;
}

module.exports.roleAssign = (message, role_name, role_color, role_permits, role_position) => {
  
  let guild = message.guild;

  let role = guild.roles.find("name", role_name);
  if (!gRole){

    guild.createRole({
      data: {
        name: role_name,
        color: role_color,
        hoist: false,
        mentionable: false,
        //permissions
        //position
      },
    });

  }

  if(message.author.role.has(gRole.id)){
    rMember.send(`has already this role`)
    return;
  }
  
  await (rMember.addRole(gRole.id));

  try {
    await rMember.send(`Congrats, you have been given the role ${gRole.name}`)
  } catch (e) {
    console.log(e.stack);
    message.channel.send(`Congrats to <@${rMember.id}>, they have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked.`)
  }
  return;  
}