const words = require("../bot_config_json/auto_mod_words.json");
const conf = require("../bot_config_json/botconfig.json");

const swearWords = words.bad_words;
const aut_writers = conf.aut_writers;
const time_auto_delete = conf.time_auto_delete;

class _auto_mod
{   
    async auto_mod(message)
    {
        if(message.author.bot) {return;}
        
        if( swearWords.some(word => message.content.includes(word)) ) {
            message.delete();
            message.author.send('Hey Hey! That word has been banned, please don\'t use it!');
        }
    }

    async keep_deleted(message)
    {
        if( !aut_writers.some(word => message.author.id === word) &&
            !command_list.some(word => message.content === word)) 
            {
                message.delete();
                message.reply("You can't type here!").then(async message => {
                    message.delete(time_auto_delete);
                });
        }
    }
}
module.exports = _auto_mod;