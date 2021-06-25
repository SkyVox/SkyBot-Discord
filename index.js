const Discord = require("discord.js");
const client = new Discord.Client();
const executeCommand = require("./src/commands/handler/CommandHandler");
require("dotenv").config();

client.on('ready', () => {
    console.log(`Bot has started with id: ${client.user.tag}`);
});

client.on('message', executeCommand);

/**
* Login.
*/
client.login(process.env.DISCORD_TOKEN);