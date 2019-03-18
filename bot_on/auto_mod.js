//extra_files
const words = require("../bot_config/auto_mod_words.json");

//utilities
const botconfig = require("../bot_config/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");
const utils = require("../utils/utils.js");

//external_libs
const fse = require('fs-extra');

//variables
let guild_config

class _auto_mod
{   
    auto_mod(message)
    {
        if(message.author.bot) {return;}
        
        if( words.level_1.some(word => message.content.includes(word)) ) {
            message.delete();
            message.author.send('Hey hey hey! That word has been banned, please don\'t use it!');
        }
    }

    async keep_deleted(message)
    {

        let file_dir = utils.jsonLogName(message, "guild_config");
        let json_file = utils.jsonLogOpen(file_dir);

        if(!json_file["channel_keep_deleted"])
        {
            json_file["channel_keep_deleted"] = {
                channels: [""]
            }
            utils.jsonLogSave(file_dir, json_file);
        }
        
        let channels_id = json_file["channel_keep_deleted"].channels;
        let array = channels_id.slice(0);

        if(array.includes(message.channel.id)) {
            if( !botconfig.auto_delete_ignore.includes(message.author.id)) 
            {
                message.delete().catch(console.error);
                errors.noChatHere(message);
            }
        }
}

}
module.exports = _auto_mod;