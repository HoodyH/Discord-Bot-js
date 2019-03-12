

const embed = new RichEmbed()
.setTitle("ciao")
.setAuthor(message.author.tag, message.author.displayAvatarURL)
.addField('song')
.addField("Song Name: [masked links](http://google.com)")
.setImage("https://cdn.discordapp.com/attachments/539063574556049421/546138814502928391/13329027_1726897880857890_7918221_n.jpg")
.setThumbnail("https://cdn.discordapp.com/attachments/539063574556049421/546138814502928391/13329027_1726897880857890_7918221_n.jpg")
.setColor(0xFFFFFF)
.setTimestamp()
.setDescription('Hello, descriprionakjhafd')
.setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
//.setFooter(`⭐ ${parseInt(star[1])-1} | ${message.id}`);

message.channel.send(embed).then(async message => {
await message.react("❤")
await message.react("👎");
await message.react("🇸");
await message.react("🇴");
await message.react("🇳");
await message.react("🇬");
});

{
    "content": "this `supports` __a__ **subset** *of* ~~markdown~~ 😃 ```js\nfunction foo(bar) {\n  console.log(bar);\n}\n\nfoo(1);```",
    "embed": {
      "title": "title ~~(did you know you can have markdown here too?)~~",
      "description": "this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```",
      "url": "https://discordapp.com",
      "color": 9191753,
      "timestamp": "2019-02-19T23:52:49.941Z",
      "footer": {
        "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
        "text": "footer text"
      },
      "thumbnail": {
        "url": "https://cdn.discordapp.com/embed/avatars/0.png"
      },
      "image": {
        "url": "https://cdn.discordapp.com/embed/avatars/0.png"
      },
      "author": {
        "name": "author name",
        "url": "https://discordapp.com",
        "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
      },
      "fields": [
        {
          "name": "🤔",
          "value": "some of these properties have certain limits..."
        },
        {
          "name": "😱",
          "value": "try exceeding some of them!"
        },
        {
          "name": "🙄",
          "value": "an informative error should show up, and this view will remain as-is until all issues are fixed"
        },
        {
          "name": "<:thonkang:219069250692841473>",
          "value": "these last two",
          "inline": true
        },
        {
          "name": "<:thonkang:219069250692841473>",
          "value": "are inline fields",
          "inline": true
        }
      ]
    }
  }


const member = message.member;
const mess = args.content.toLowerCase();
const arg = args.content.split(' ').slice(1).join(" ");



/*
Example video object:
 
Video {
    title: 'Dr. Dre - I Need A Doctor (Explicit) ft. Eminem, Skylar Grey',
    id: 'VA770wpLX-Q',
    description: 'Get COMPTON the NEW ALBUM from Dr. Dre on Apple Music: http://smarturl.it/Compton \n\nMusic
    video by Dr. Dre performing I Need A Doctor featuring Eminem and Skylar Grey (Explicit). © 2011 Aftermath
     Records\n#VEVOCERTIFIED on Aug. 17, 2012. http://www.youtube.com/vevocertified',
    duration:
     { weeks: 0,
       years: 0,
       months: 0,
       days: 0,
       hours: 0,
       minutes: 7,
       seconds: 37 },
    durationSeconds: 457 },
 
as well as a few getters:
 
video.length
video.thumbnail
video.url
 
video.length is the duration formatted as HH:MM:SS
*/