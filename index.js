const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();
require("./src/commands/CommandManager.ts");

const RPS = require("./src/games/RPSGame.ts");

/**
 * Commands and fun parties.
 */
Command: commands = [
    new RPS()
];

client.on('ready', () => {
    console.log(`Bot has started with id: ${client.user.tag}`);
});

client.on('message', message => {
    for (n in commands) {
        commands[n].runCommand(message);
    }
});

/**
* Login.
*/
client.login(process.env.DISCORD_TOKEN);