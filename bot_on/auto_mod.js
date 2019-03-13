//extra_files
const words = require("../bot_config_json/auto_mod_words.json");

//utilities
const botconfig = require("../bot_config_json/botconfig.json");
const errors = require("../utils/errors.js");
const notifications = require("../utils/notifications.js");
const permits = require("../utils/permits_ceck.js");

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
        const storage_location = "./storage";
        const guild_id = message.guild.id;
        const dir = `${storage_location}/${guild_id}`; //song_request.json
        const file_dir = `${dir}/guild_config.json`;

        try {
            guild_config = require("."+file_dir);
        } catch (err) {
            if (err.code == 'MODULE_NOT_FOUND') {
                fse.outputFileSync(file_dir, "{}");
                guild_config = require("."+file_dir);
            }
        }

        if(!guild_config["channel_keep_deleted"])
        {
            guild_config["channel_keep_deleted"] = {
                channels_id: []
            }
            fse.outputFileSync(file_dir, JSON.stringify(guild_config, null, 4));
        }
        
        let channels_id = guild_config["channel_keep_deleted"].channels_id;
        let array = channels_id.slice(0);

        if(array.includes(message.channel.id)) {
            if( !botconfig.aut_writers.includes(message.author.id)) 
            {
                message.delete().catch(console.error);
                errors.noChatHere(message);
            }
        }
}

}
module.exports = _auto_mod;