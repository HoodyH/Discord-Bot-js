const fs = require('fs');

class _msg_log
{
    async user_informations_log(message, file)
    {
        if(message.author.bot) {return;}

        if(!message.content == "log test")
        {
            message.channel.send ("logging");
            const user = message.author.tag;

            file [user] = {
                message: message.content
            }

            fs.writeFile ("./storage/NLD/msgs.json", JSON.stringify(file, null, 4), err =>{
                if (err) throw err;
                message.channel.send ("message written");
            });
        }
    }//end user_informations_log

    async msg_log(message)
    {
        if(message.author.bot) {return;}

        const user = message.author.tag.replace(/#/g,"_");
        var time = message.createdAt
            .toString()
            .slice(4,33)
            .replace(/ /g,"_")
            .replace(/:/g,"_")
            .replace(/\+/g,"_");
        const format = ".png"
        const path = "./storage/NLD/imgs/"
        var img_name = user + "_" + time + format;

        const att = message.attachments;

        console.log(img_name.toString()); 
               
        att.forEach(function(attachment) {
              
            https.request(attachment.proxyURL, function(response) {                                        
                var data = new Stream();                                                    
              
                response.on('data', function(chunk) {                                       
                  data.push(chunk);                                                         
                });                                                                         
              
                response.on('end', function() {                                             
                  fs.writeFileSync(`${path}${img_name}`, data.read());                               
                });                                                                         
              }).end();
        });
    }//end sniff
        
}
module.exports = _msg_log;