const Discord = require("discord.js");

//utilities
const botconfig = require("../bot_config_json/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");

//external_libs
const fse = require("fs-extra");

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