const errors = require("../utils/errors.js");
const config = require("../bot_config_json/botconfig.json");

const fse = require('fs-extra');

var local_userdata_log;
var global_userdata_log;
const time_auto_delete = config.time_auto_delete;

class _user_data_update
{
    async user_data_update(message)
    {
        const storage_location = "./storage";
        const server_id = message.guild.id;
        const dir = `${storage_location}/${server_id}`; //song_request.json
        const local_file_dir = `${dir}/local_userdata_log.json`;
        const global_file_dir = `${storage_location}/global_userdata_log.json`

        try {
            local_userdata_log = require("."+local_file_dir);
        } catch (err) {
            if (err.code == 'MODULE_NOT_FOUND') {
                fse.outputFileSync(local_file_dir, "{}");
                local_userdata_log = require("."+local_file_dir);
            }
        }

        try {
            global_userdata_log = require("."+global_file_dir);
        } catch (err) {
            if (err.code == 'MODULE_NOT_FOUND') {
                fse.outputFileSync(global_file_dir, "{}");
                global_userdata_log = require("."+global_file_dir);
            }
        }

        if(!local_userdata_log[message.author.id]){
            local_userdata_log[message.author.id] = {
                xp: 0,
                level: 1,
                total_msg: 0,
                swear_words_counter: 0,
                swear_words: {},
                time_spent: 0,
                toxicity_rank:0,
                role:0,
                bits:10
            };
        }

        if(!global_userdata_log[message.author.id]){
            global_userdata_log[message.author.id] = {
                xp: 0,
                level: 1,
                total_msg: 0,
                swear_words_counter: 0,
                swear_words: {},
                time_spent: 0,
                toxicity_rank:0
            };
        }

        //
        //xp manage
        //----------------------------------------------
        var local_log = local_userdata_log[message.author.id];
        var global_log = global_userdata_log[message.author.id];

        let xpAdd = Math.floor(Math.random() * 7) + 8;
        console.log(xpAdd);

        let curxp = local_log.xp;
        let curlvl = local_log.level;
        let nxtLvl = local_log.level * 300;

        local_log.xp =  curxp + xpAdd;
        
        if(nxtLvl <= local_log.xp){
            local_log.level = curlvl + 1;
            let lvlup = new Discord.RichEmbed()
            .setTitle("Level Up!")
            .setColor(purple)
            .addField("New Level", curlvl + 1);

            message.channel.send(lvlup).then(msg => {msg.delete(time_auto_delete)});
        }

        //
        //coin manage
        //----------------------------------------------
        let coinAmt = Math.floor(Math.random() * 15) + 1;
        let baseAmt = Math.floor(Math.random() * 15) + 1;
        console.log(`${coinAmt} ; ${baseAmt}`);

        if(coinAmt === baseAmt){
            local_log = {
            bits: local_log.bits + coinAmt
            };

            let coinEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setColor("#0000FF")
            .addField("💸", `${coinAmt} coins added!`);
            
            message.channel.send(coinEmbed).then(msg => {msg.delete(time_auto_delete)});
        }

        fse.outputFileSync(file_dir, JSON.stringify(song_request_log, null, 4));

    }//end_user_data_update
    
}
module.exports = _user_data_update;