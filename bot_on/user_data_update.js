const errors = require("../utils/errors.js");
const botconfig = require("../bot_config_json/botconfig.json");

const Discord = require("discord.js");
const fse = require("fs-extra");

let local_userdata_log;
let global_userdata_log;
const time_auto_delete = botconfig.time_auto_delete;
let cooldown = new Set();

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

                local_userdata_log["guild_data"] = {
                    levelup_notification: 0,
                    levelup_notification_location: 0,
                    levelup_sentence: "Level up! stop spamming boiii",
                    auto_role_base: 0,
                    auto_role_en: 0,
                    auto_role_assign: 0,
                    nr_of_role: 3,
                    role_at: [0,20,30,40],
                    role_name: ["member", "writer", "pro writer", "hyper writer"]
                };
                fse.outputFileSync(local_file_dir, JSON.stringify(local_userdata_log, null, 4));
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
                name: message.author.tag,
                deep_logging: 1,
                total_msg: 0,
                msg_commands: 0,
                msg_img: 0,
                msg_links: 0,
                xp: 0,
                levelup_notification: 0,
                level: 1,
                time_spent_sec: 0,
                role:0,
                bits:10,
                swear_words_counter: 0,
                swear_words: {},
                toxicity_rank: 0,
                soft_warnigs: 0,
                hard_warnigs: 0,
                admin_warnings: 0,
                gender: "ND",
                age: "ND",
                country: "ND",
                speak_in_vc: "ND"
            };
        }

        if(!global_userdata_log[message.author.id]){
            global_userdata_log[message.author.id] = {
                name: message.author.tag,
                deep_logging: 1,
                total_msg: 0,
                msg_commands: 0,
                msg_img: 0,
                msg_links: 0,
                xp: 0,
                levelup_notification: 0,
                level: 1,
                time_spent_sec: 0,
                role:0,
                bits:10,
                swear_words_counter: 0,
                swear_words: {},
                toxicity_rank: 0,
                soft_warnigs: 0,
                hard_warnigs: 0,
                admin_warnings: 0,
                gender: "ND",
                age: "ND",
                country: "ND",
                speak_in_vc: "ND"
            };
        }

        const local_log = local_userdata_log[message.author.id];
        const global_log = global_userdata_log[message.author.id];
        const local_config = local_userdata_log["guild_data"];
        
        local_log.name = global_log.name = message.author.tag;
        local_log.total_msg++;
        global_log.total_msg++;

        if(!cooldown.has(message.author.id)){

            //xp manage
            //----------------------------------------------
            let xpAdd = Math.floor(Math.random() * 7) + 8;
            //console.log(xpAdd);
            
            local_log.xp += xpAdd;
            global_log.xp += xpAdd;

            //local_level up
            let local_nxtLvl = local_log.level * botconfig.level_increment_value;
            
            if(local_nxtLvl <= local_log.xp){
                local_log.level++;

                if(local_log.level == botconfig.start_notificatons_at_level){ //reached a prefixed level start the notifications
                    local_log.levelup_notification = 1;
                }

                if(local_log.levelup_notification == 1){
                    let lvlup_notification = new Discord.RichEmbed()
                            .setTitle("Level Up!")
                            .setColor(botconfig.purple)
                            .addField("New Level", local_log.level);
                            //.addField("You can disable level notification with !level.notific_toggle");

                    switch(local_config.levelup_notification_location){
                        case 1:
                            message.channel.send(lvlup_notification).then(msg => {msg.delete(time_auto_delete)});
                            break;
                        case 2:
                            message.channel.send(lvlup_notification).then(msg => {msg.delete(time_auto_delete)});
                            break;
                    }
                }//end local_log.levelup_notification
            }//end local levelup routine

            //global level up
            let global_nxtLvl = global_log.level * botconfig.level_increment_value;
            
            if(global_nxtLvl <= global_log.xp){
                global_log.level++;

                if(global_log.level == botconfig.start_notificatons_at_level){ //reached a prefixed level start the notifications
                    global_log.levelup_notification = 1;
                }

                if(global_log.levelup_notification == 1){
                        let lvlup_notification = new Discord.RichEmbed()
                            .setTitle("Global Level Up!")
                            .setColor(botconfig.purple)
                            .addField("New Level", global_log.level);
                            //.addField("You can disable level notification with !level.notific_toggle");
                    
                        message.channel.send(lvlup_notification).then(msg => {msg.delete(time_auto_delete)});   
                }//end global_log.levelup_notification
            }//end global levelup routine
            
            //ad time spent
            local_log.time_spent_sec += botconfig.xp_cooldown_sec;
            global_log.time_spent_sec += botconfig.xp_cooldown_sec;

            //auto role assigment

            if(local_log.auto_role_base == 1){
                //give_base_role
            }else{
                //remove base role
            }
            

            if(local_log.auto_role_en == 1)
            {
                if(local_log.level >= local_config.role_at[3]){
                    local_log.role = 3;
                    //give_role
                    //remove_role 1-2
                }else if(local_log.level >= local_config.role_at[2])
                    {
                        local_log.role = 2;
                        //give_role
                        //remove_role 1-3
                    }else if(local_log.level >= local_config.role_at[1])
                        {
                            local_log.role = 1;
                            //give_role
                            //remove_role 2-3
                        }else{
                            local_log.role = 0;
                            //remove_role 1-2-3
                        }
            }
            
            //bits manage
            //----------------------------------------------
            let bitsAmt = Math.floor(Math.random() * 15) + 1;
            let baseAmt = Math.floor(Math.random() * 15) + 1;
            //console.log(`${bitsAmt} ; ${baseAmt}`);

            if(bitsAmt === baseAmt){
                local_log.bits += bitsAmt;
                global_log.bits += bitsAmt;
            }

            cooldown.add(message.author.id); //read cooldown
            setTimeout(() => {
                cooldown.delete(message.author.id)
            }, botconfig.xp_cooldown_sec * 1000)

        } //end if cooldown

        fse.outputFileSync(local_file_dir, JSON.stringify(local_userdata_log, null, 4));
        fse.outputFileSync(global_file_dir, JSON.stringify(global_userdata_log, null, 4));

    }//end_user_data_update
}
module.exports = _user_data_update;