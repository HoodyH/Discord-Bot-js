//utilities
const botconfig = require("../bot_config/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");
const utils = require("../utils/utils.js");
const com = require("../bot_config/commands_config.js").com;

//external_libs
const Discord = require("discord.js");
const YT = require("discord-youtube-api");
const youtube = new YT(botconfig.youtube_TOKEN);


module.exports.run = async (bot, message, args) => {

  message.delete().catch(console.error);

  let file_dir = utils.jsonLogName(message, "song_request_log");
  let json_file = utils.jsonLogOpen(file_dir);
  const u_log = json_file[message.author.id];
  const g_log = json_file["guild_data"];

  if(!json_file["guild_data"])
  {
    json_file["guild_data"] = {
      guild_id: message.guild.id,
      guild_name: message.guild.name,

      only_admin_command: 0,
      enabled: 1,
      man_as_last_message: 1,
      last_man_message_id: "",
    
      lock_in_channel_required: 1,
      lock_in_channel_en: 1,
      channel_id: "ND",
      channel_name: "ND",
      private_mode: 0, //don't show username of the person who request the song

      active_users_counter: 1,
      songs_counter: 0,
      requests_on: 0,
      time_dancing: 0,

      video_max_lenght: 300,
    
      logo: "AB_Songs", //to move to guild config
      creator_name: "The Boss", //to move to guild config
      
      days_before_same_song_en: 1,
      user_days_before_same_song: 1,
      guild_days_before_same_song: 1,

      songs_per_day_en: 1,
      songs_today_counter: 0,
      last_reset: "",
      user_songs_per_day: 5,
      guild_songs_per_day: 100,
      
      cooldown_time: 0,

      auto_role_en: 1,
      auto_role_assign: 0,
      role_at: [100,200,500],
      role_color: [botconfig.green, botconfig.orange, botconfig.purple],
      role_name: ["S","SS","SSS"],
      vid_ids: [],
      vid_add_times: []
    };
    utils.jsonLogSave(file_dir, json_file);
  }
  //if user do not exist create it
  if(!json_file[message.author.id])
  {
    json_file[message.author.id] = {
      name: message.author.tag,
      songs_counter: 0,
      role: 0,
      requests_on: 0,
      time_dancing: 0,
      songs_today_counter: 0,
      last_reset: "",
      vid_ids: [],
      vid_add_times: []
    };

    try {
      g_log.active_users_counter += 1;
    } catch (err) {}
  }

  //prececk----------------------------------
  if(! await utils.preCeck(bot, message, args, file_dir, json_file, com.dance_request))
  {return;}

  //no link provide
  if(args == "")
  {
    errors.genericError(message, "You have to put a YT link!");
    return;
  }
  //prececk ended----------------------------------

  let date_now = new Date();
  let u_vid_id = u_log.vid_ids.slice(0);
  let u_vid_add_times = u_log.vid_add_times.slice(0);
  let g_vid_id = g_log.vid_ids.slice(0);
  let g_vid_add_times = g_log.vid_add_times.slice(0);

  //---------------------------------------------------------
  //video times controll
  
  if(g_log.days_before_same_song_en == 1){ //if bot are disabled i dont need to log the songs
    
      function removeOldVids(vid_ids, vid_add_times, requests_on, time) {
        let deleted_count = 0;
        for(let i = 0; i <requests_on; i++){
          if (utils.dataDiff(date_now, vid_add_times[i]) >= time) {
            vid_ids.splice(i, 1);
            vid_add_times.splice(i, 1);
            deleted_count++;
          }
        }
        return requests_on -= deleted_count;
      }
      u_log.requests_on = removeOldVids(u_vid_id, u_vid_add_times, u_log.requests_on, g_log.user_days_before_same_song);
      g_log.requests_on = removeOldVids(g_vid_id, g_vid_add_times, g_log.requests_on, g_log.guild_days_before_same_song);
  }

  if(g_log.songs_per_day_en == 1){

      //Control of songs per day if is void inizialize it
      //ceck user reset 
      if(u_log.last_reset == ""){
        u_log.last_reset = date_now;
        u_log.songs_today_counter = 0;
      }else if(utils.dataDiff(date_now, u_log.last_reset) >= 1){
          u_log.last_reset = date_now;
          u_log.songs_today_counter = 0;
      }
      //ceck server reset 
      if(g_log.last_reset == ""){
        g_log.last_reset = date_now;
        g_log.songs_today_counter = 0;
      }else if(utils.dataDiff(date_now, g_log.last_reset) >= 1){
          g_log.last_reset = date_now;
          g_log.songs_today_counter = 0;
      }
      
      if(u_log.songs_today_counter >= g_log.user_songs_per_day)
      {
        let day = utils.dataToDay(u_log.last_reset);
        let time = utils.dataToTime(u_log.last_reset);
        let text =  "You have already request your " + g_log.user_songs_per_day + " songs for today!\n" +
                    "Your song counter will rest in " + 
                    utils.dataDiff(date_now, u_log.last_reset, "h", "ceil") + " h\n"+
                    "Your last reset was on " + day + " at " + time;
        errors.genericError(message, text);
        return;
      }
      if(g_log.songs_today_counter >= g_log.guild_songs_per_day)
      {
        let day = utils.dataToDay(g_log.last_reset);
        let time = utils.dataToTime(g_log.last_reset);
        let text =  "The server has reached " + g_log.guild_songs_per_day + "songs for today!\n" +
                    "The request command is paused, it will back up in " +
                    utils.dataDiff(date_now, g_log.last_reset, "h", "ceil") + " h\n" +
                    "The server last reset was on " + day + " at " + time;
        errors.genericError(message, text);
        return;
      }
  }
  
  //video API request
  let video;
  try {
    video = await youtube.getVideo(args.toString());
  } catch (err) {
    errors.genericError(message, "The video can't be resolved, ceck the link provided");
  }

  const title = video.title.toLocaleUpperCase();
  
  if(video.durationSeconds > g_log.video_max_lenght){
    errors.genericError(message, `The video must be shorter then ${g_log.video_max_lenght/60} min!`);
    return;
  }

  if(g_log.days_before_same_song_en == 1)
  {
      //ceck if the vid is already inside the list
      for(let i = 0; i <u_log.requests_on; i++){
        if (u_log.vid_ids[i] == video.id) 
        {
          let day = utils.dataToDay(u_log.vid_add_times[i]);
          let time = utils.dataToTime(u_log.vid_add_times[i]);
          let error = "You added this song on " + day + " at " + time + 
                      "\nYou have to wait " + g_log.user_days_before_same_song + 
                      " days before have the ability to ad the same song again";
          errors.genericError(message, error);
          return;
        }
      }
      for(let i = 0; i <g_log.requests_on; i++){
        if (g_log.vid_ids[i] == video.id) 
        {
          let day = utils.dataToDay(g_log.vid_add_times[i]);
          let time = utils.dataToTime(g_log.vid_add_times[i]);
          let error = "This song has been added on " + day + " at " + time + 
                      "\nYou have to wait " + g_log.guild_days_before_same_song + 
                      " days before have the ability to ad the same song again";
          errors.genericError(message, error);
          return;
        }
      }

      u_vid_id.push(video.id);
      u_vid_add_times.push(date_now); 
      g_vid_id.push(video.id);
      g_vid_add_times.push(date_now);

      u_log.vid_ids = u_vid_id;
      g_log.vid_ids = g_vid_id;
      u_log.vid_add_times = u_vid_add_times;
      g_log.vid_add_times = g_vid_add_times;  

      u_log.requests_on += 1;
      g_log.requests_on += 1;
  }

  if(g_log.songs_per_day_en == 1){   
    u_log.songs_today_counter++;
    g_log.songs_today_counter++;
  }
    
  //new parameters calculate and let
  g_log.guild_name = message.guild.name;
  u_log.name = message.author.tag;
  g_log.channel_name = message.channel.name;
  g_log.songs_counter += 1;
  u_log.songs_counter += 1;
  u_log.time_dancing += video.durationSeconds;
  g_log.time_dancing += video.durationSeconds;

  //role management
  if(g_log.role_reward == 1){

    if(u_log.songs_counter > g_log.unlock_role_at)
    {
      u_log.role = 1;
    }else{
      u_log.role = 0;
    }

    let embed_color;

    if(u_log.role == 0){
      embed_color = botconfig.black;
    }else{
      for(let i = 0; i<g_log.role_at.length(); i++){
        if(u_log.role == i){
          embed_color = g_log.role_color[i];
        }
      }
    }
  }else{
    embed_color = botconfig.black;
  }

  let description = "You have request **" + u_log.songs_counter +  "** songs, and **" + g_log.creator_name + 
                    "** has danced for you **" + utils.secondsToTime(u_log.time_dancing) + "**\n" 
                    "This song is **" + video.length + "min** long";

  let embed = new Discord.RichEmbed()
      .setColor(embed_color)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTitle(title)
      .setURL(video.url)
      .setDescription(description)
      .setThumbnail(video.thumbnail)
      .addField("Golbal Counter", g_log.songs_counter, true)
      .addField("All Time dancing", utils.secondsToTime(g_log.time_dancing), true)
      .setTimestamp(new Date())
      .setFooter(`© ${g_log.logo}`)

  message.channel.send(embed).then(async message => {
    
    await message.react("✅");
    await message.react("❌");
    //await message.react("❤");
    //await message.react("👎");
    //await message.react("🇸");
    //await message.react("🇴");
    //await message.react("🇳");
    //await message.react("🇬");
  });

  g_log.last_man_message_id = await utils.manAsLastMessage(bot, message, json_file, com.dance_request);

  utils.jsonLogSave(file_dir, json_file);
}


module.exports.help = {
  name: com.dance_request.name,
}

// \dance.request https://www.youtube.com/watch?v=edeMiqWgWx0