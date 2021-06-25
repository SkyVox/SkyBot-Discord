const Discord = require("discord.js");
const client = new Discord.Client();
const { handleCommand, handleReaction } = require("./src/commands/handler/CommandHandler");
require("dotenv").config();

client.on('ready', () => {
    console.log(`Bot has started with id: ${client.user.tag}`);
});

client.on('message', handleCommand);
client.on('messageReactionAdd', handleReaction);

/**
* Login.
*/
client.login(process.env.DISCORD_TOKEN);