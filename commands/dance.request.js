const command_name = "dance.request";
const errors = require("../utils/errors.js");
const botconfig = require("../bot_config_json/botconfig.json");

const fse = require('fs-extra');
const YT = require("discord-youtube-api");

const youtube = new YT(botconfig.youtube_TOKEN);

let song_request_log;
const time_auto_delete = botconfig.time_auto_delete;

module.exports.run = async (bot, message, args) => {

    message.delete().catch(console.error);

    const storage_location = "./storage";
    const server_id = message.guild.id;
    const dir = `${storage_location}/${server_id}`; //song_request.json
    const file_dir = `${dir}/song_request_log.json`;

    try {
        song_request_log = require("."+file_dir);
    } catch (err) {
        if (err.code == 'MODULE_NOT_FOUND') {
            fse.outputFileSync(file_dir, "{}");
            song_request_log = require("."+file_dir);
        }
    }

    if(!song_request_log["guild_data"])
    {
      song_request_log["guild_data"] = {
        song_counter: 0,
        vid_id: ["",""],
        time: ["",""],
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
      fse.outputFileSync(file_dir, JSON.stringify(song_request_log, null, 4));
    }
    //if user do not exist create it
    if(!song_request_log[message.author.id])
    {
      song_request_log[message.author.id] = {
        name: message.author.tag,
        song_counter: 0,
        vid_id: ["",""],
        time: ["",""],
        role: 0,
        request_on: 0,
        time_dancing: 0
      };
    }
    
    const u_log = song_request_log[message.author.id];
    const g_log = song_request_log["guild_data"];


    //prececk
    if(args == "init" && g_log.lock_in_channel_en == 1)
    {
      if(message.member.hasPermission("ADMINISTRATOR"))
      {
        g_log.channel_id = message.channel.id;
        g_log.channel_name = message.channel.name;
        fse.outputFileSync(file_dir, JSON.stringify(song_request_log, null, 4));
        message.channel.send("Init in this channel completed").then(async message => {
            message.delete(time_auto_delete);
        });
        return;
      }else{
        message.channel.send("You need **ADMINISTRATOR** role! boiii").then(async message => {
            message.delete(time_auto_delete);
        });
        return;
      }
    }

    if(g_log.channel_id != "ND" && g_log.lock_in_channel_en == 1 && message.channel.id != g_log.channel_id){
      message.channel.send("Wrong channel for this command bru, go in **#" + g_log.channel_name + "**").then(async message => {
        message.delete(time_auto_delete);
      });
      return;
    }

    if(g_log.lock_in_channel_en == 1 && g_log.channel_id == "ND")
    {
      let prefix = require("../storage/prefixes");
      message.channel.send("You have to **init** the channel, use " + prefix[message.guild.id].prefix + command_name + " init\n and for **keep this chat cleen** of text use " + prefix[message.guild.id].prefix + "deleted.auto")
        .then(async message => {
          message.delete(time_auto_delete);
      });
      return;
    }

    if(args == ""){
      message.channel.send("You have to put a YT link!").then(async message => {
        message.delete(time_auto_delete);
      });
      return;
    }

    const u_requests_on = u_log.requests_on;
    const g_requests_on = g_log.requests_on;

    const single_user_songs_per_day = g_log.single_user_songs_per_day;
    const video_max_lenght = g_log.video_max_lenght; //tempo massimo del video in secondi

    //ceck number of songs per day by single user and by boss
    if(g_logs.single_user_songs_per_day_en == 1 && u_requests_on > single_user_songs_per_day)
    {
        message.channel.send("Yooo, you have already request "+ single_user_songs_per_day + " songs!").then(async message => {
            message.delete(time_auto_delete);
        });
        return;
    }
    //numero di canzoni richiedibili al giorno
    //sono passate almeno le ore

    const video = await youtube.getVideo(args.toString()); //richiesta del video   
    
    if(video.durationSeconds > video_max_lenght){
      message.channel.send(message.author.username + " **the video must be shorter** then " + video_max_lenght/60 + " min!").then(async message => {
        message.delete(time_auto_delete);
      });
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

    fse.outputFileSync(file_dir, JSON.stringify(song_request_log, null, 4));
    
    var convertSeconds = function(sec) 
    {
      var days = Math.floor(sec / (3600*24));
      var hrs = Math.floor((sec - (days * (3600*24))) / 3600);
      var min = Math.floor((sec - (days * (3600*24)) - (hrs * 3600)) / 60);
      var seconds = sec - (days * (3600*24)) - (hrs * 3600) - (min * 60);
      seconds = Math.round(seconds * 100) / 100
     
      var result = (days != 0 ? days + "d " : "");
      result += (hrs != 0 || days != 0  ? (hrs < 10 ? "0" + hrs : hrs) + "h " : "");
      result += (min != 0 || hrs != 0 || days != 0 ? (min < 10 ? "0" + min : min) + "m " : "");
      result += (seconds < 10 ? "0" + seconds : seconds);
      result += "s";
      return result;

    }//end convert seconds

    message.channel.send({embed: {
        color: 1,
        author: {
          "name": message.author.tag,
          "icon_url": message.author.displayAvatarURL
        },
        title: title,
        url: video.url,
        description: `You had request **${u_log.song_counter}** songs, and **${g_log.creator_name}** has danced for you **${convertSeconds(u_log.time_dancing)}**\nThis song is **${video.length} min** long`,
        thumbnail: {
            "url": video.thumbnail
        },
        fields: [{
            "name": "Golbal Counter",
            "value": g_log.song_counter,
            "inline": true
          },
          {
            "name": "All Time dancing",
            "value": convertSeconds(g_log.time_dancing),
            "inline": true
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `© ${g_log.logo}`
        }
      }
    }).then(async message => {
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
