//command_name
const command_name = "dance.request";

//utilities
const botconfig = require("../bot_config_json/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");
const utils = require("../utils/utils.js");

//external_libs
const Discord = require("discord.js");
const YT = require("discord-youtube-api");
const youtube = new YT(botconfig.youtube_TOKEN);


module.exports.run = async (bot, message, args) => {

    message.delete().catch(console.error);

    let file_dir = utils.jsonLogName(message, "song_request_log");
    let json_file = utils.jsonLogOpen(file_dir);

    if(!json_file["guild_data"])
    {
      json_file["guild_data"] = {
        song_counter: 0,
        vid_id: [],
        time: [],
        request_on: 0,
        time_dancing: 0,
        logo: "AB_Songs",
        creator_name: "The Boss",
        private_mode: 0, //don't show username of the person who request the song
        video_max_lenght: 300,
        single_user_songs_per_day_en: 0,
        single_user_songs_per_day: 5,
        total_songs_per_day_en: 0,
        total_songs_per_day: 100,
        cooldown_time: 0,
        auto_role_en: 1,
        auto_role_assign: 0,
        role_at: [100,200,500],
        role_color: [botconfig.green, botconfig.orange, botconfig.purple],
        role_name: ["S","SS","SSS"],
        lock_in_channel_en: 1,
        channel_id: "ND",
        channel_name: "ND"
        
      };
      utils.jsonLogSave(file_dir, json_file);
    }
    //if user do not exist create it
    if(!json_file[message.author.id])
    {
      json_file[message.author.id] = {
        name: message.author.tag,
        song_counter: 0,
        vid_id: [],
        time: [],
        role: 0,
        request_on: 0,
        time_dancing: 0
      };
    }
    
    const u_log = json_file[message.author.id];
    const g_log = json_file["guild_data"];


    //prececk----------------------------------

    //recicived a init request, ceck permissions before go
    if(args == "init" && g_log.lock_in_channel_en == 1)
    {
      if(permits.configurator(message))
      {
        g_log.channel_id = message.channel.id;
        g_log.channel_name = message.channel.name;
        utils.jsonLogSave(file_dir, json_file);

        notifications.initDone(message);
        return;  

      //this user cant init cause not enought permissions
      }else{ 
        errors.noPermits(message, "configurator")
        return;
      }
    }

    //ceck if you are in the correct channel
    if(g_log.channel_id != "ND" && g_log.lock_in_channel_en == 1 && message.channel.id != g_log.channel_id)
    {
      errors.wrongChannel(message, g_log.channel_name);
      return;
    }

    //init required, the command dont have a channel assigned
    if(g_log.lock_in_channel_en == 1 && g_log.channel_id == "ND")
    {
      notifications.init(message, command_name);
      return;
    }

    //no link providec
    if(args == "")
    {
      errors.commandError(message, "You have to put a YT link!");
      return;
    }

    //prececk ended----------------------------------

    //shortcuts
    const u_requests_on = u_log.requests_on;
    const g_requests_on = g_log.requests_on;

    const single_user_songs_per_day = g_log.single_user_songs_per_day;
    const video_max_lenght = g_log.video_max_lenght; //max time in sec for not elimitate the video

    //ceck number of songs per day by single user and by boss
    if(g_log.single_user_songs_per_day_en == 1 && u_requests_on > single_user_songs_per_day)
    {
      errors.commandError(message, `message, Yooo, you have already request ${single_user_songs_per_day} songs!`);
      return;
    }

    const video = await youtube.getVideo(args.toString()); //video API request
    
    if(video.durationSeconds > video_max_lenght){
      errors.commandError(message, `**the video must be shorter** then ${video_max_lenght/60} min!`);
      return;
    }

    const title = video.title.toLocaleUpperCase();

    //new parameters calculate and let
    g_log.channel_name = message.channel.name;
    u_log.name = message.author.tag;
    g_log.song_counter++;
    u_log.song_counter++;
    u_log.vid_id[u_requests_on] = video.id;
    g_log.vid_id[g_requests_on] = video.id;
    var d = new Date();
    u_log.time[u_requests_on] = g_log.time[g_requests_on] = d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear() + "@" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    if(g_log.role_reward == 1 && u_log.song_counter > g_log.unlock_role_at)
    {
      u_log.role = 1;
    }else{
      u_log.role = 0;
    }
    u_log.request_on++;
    g_log.request_on++;
    u_log.time_dancing += video.durationSeconds;
    g_log.time_dancing += video.durationSeconds;

    utils.jsonLogSave(file_dir, json_file);

    let embed = new Discord.RichEmbed()
        .setColor(botconfig.black)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTitle(title)
        .setURL(video.url)
        .setDescription(`You had request **${u_log.song_counter}** songs, and **${g_log.creator_name}** has danced for you **${utils.secondsToTime(u_log.time_dancing)}**\nThis song is **${video.length} min** long`)
        .setThumbnail(video.thumbnail)
        .addField("Golbal Counter", g_log.song_counter, true)
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

}

module.exports.help = {
  name: command_name
}

// \dance.request https://www.youtube.com/watch?v=edeMiqWgWx0