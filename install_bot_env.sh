#!/bin/bash

echo "Installing"

sudo apt install curl
sudo apt remove --purge node* npm*
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

#copy the bot code inside the folder, and execute this inside
sudo npm init
sudo npm install discord.js --save
#commando object orientated discord
#sudo npm install discord.js-commando --save 

#nightmare (bot for web controll)
sudo npm install --save nightmare
#youtube (api to get informations from youtube)
sudo npm install --save discord-youtube-api
#fs-extra (for manage file easily)
sudo npm install --save fs-extra
