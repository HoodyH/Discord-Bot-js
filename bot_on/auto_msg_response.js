class _auto_msg_response
{
    async auto_msg_response(message)
    {
        if(message.content == "hello")
        {
            message.channel.send("Hello " + message.author + ", how are you"); //risponde al messaggio senza menzionare nessuno
            //message.reply('hello, how are you');
        }
    }
}
module.exports = _auto_msg_response;