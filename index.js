const botconfig = require("./bot_config_json/botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
let cooldown = new Set();
let cooldown_sec = botconfig.cooldown_sec;
const TOKEN = botconfig.test_TOKEN;

const Auto_mod = require("./bot_on/auto_mod.js");
const auto_mod = new Auto_mod();
const Auto_msg_response = require("./bot_on/auto_msg_response.js");
const auto_msg_response = new Auto_msg_response();
const Msg_log = require("./bot_on/msg_log.js");
const msg_log = new Msg_log();
const User_data_update = require("./bot_on/user_data_update.js");
const user_data_update = new User_data_update();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {

  console.log("Ready");
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  
  if(TOKEN == botconfig.test_TOKEN){
    console.log("I'm running the test version");
  }else{
      console.log("WARING I'M RUNNING ON MAIN BOT");
  }

  bot.user.setPresence({
    game: { 
        name: "playing",
        type: "GIRLS"
    },
    status: 'online' //idle
  });

});


bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  //msg_sniffer.sniff(message);
  //user_data_update.user_data_update(message);

  //save the prefix change differents guilds
  let prefixes = JSON.parse(fs.readFileSync("./storage/prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.defaultPrefix
    };
  }

  let prefix = prefixes[message.guild.id].prefixes;
  if(!message.content.startsWith(prefix)) return;
  if(cooldown.has(message.author.id)){
    message.delete();
    return message.reply("You have to wait 5 seconds between commands.")
  }
  if(!message.member.hasPermission("ADMINISTRATOR")){
    cooldown.add(message.author.id);
  }

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cooldown_sec * 1000)

});

bot.login(TOKEN);