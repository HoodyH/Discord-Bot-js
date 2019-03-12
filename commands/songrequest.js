const errors = require("../utils/errors.js");
const config = require("../bot_config_json/botconfig.json");

const fse = require('fs-extra');
const YT = require("discord-youtube-api");


const youtube = new YT(config.youtube_TOKEN);

let song_request_log;
const time_auto_delete = config.time_auto_delete;

module.exports.run = async (bot, message, args) => {

    message.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);

    if(args == ""){
      message.channel.send("You have to put a link!").then(async message => {
        message.delete(time_auto_delete);
      });
      return;
    }

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

    if(!song_request_log[message.author.id]){
      song_request_log["guild_data"] = {
        song_counter: 0,
        vid_id: ["",""],
        time: ["",""],
        request_on: 0,
        time_dancing: 0,
        name: "AB_Songs",
        private_mode: 0, //show username of the person who request the song
        video_max_lenght: 300,
        single_user_songs_per_day: 5,
        total_songs_per_day: 100,
        cooldown_time: 0,
        role_reward: 1,
        unlock_role_at: 100
      };
      fse.outputFileSync(file_dir, JSON.stringify(song_request_log, null, 4));
    }
    //if user do not exist create it
    if(!song_request_log[message.author.id]){
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

    const u_requests_on = u_log.requests_on;
    const g_requests_on = g_log.requests_on;

    const single_user_songs_per_day = g_log.single_user_songs_per_day;
    const video_max_lenght = g_log.video_max_lenght; //tempo massimo del video in secondi

    //ceck number of songs per day by single user and by boss
    if(u_requests_on > single_user_songs_per_day){
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
    
    message.channel.send({embed: {
        color: 1,
        author: {
          "name": message.author.tag,
          "icon_url": message.author.displayAvatarURL
        },
        title: title,
        description: "Dance Request",
        url: video.url,
        thumbnail: {
            "url": video.thumbnail
        },
        fields: [{
            "name": "Duration",
            "value": video.length,
            "inline": true
          },
          {
            "name": "Request Counter",
            "value": "1",
            "inline": true
          }
        ],
        timestamp: new Date(),
        footer: {
          text: "© NLD"
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
  name: "songrequest"
}
