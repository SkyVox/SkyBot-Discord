const Discord = require("discord.js");
const client = new Discord.Client();
const RPSCommand = require("./src/games/rockpaperscissors/RPSCmd.js");
const ClearChatCmd = require("./src/commands/ClearChatCmd.js");
require("dotenv").config();

/**
 * Commands and fun parties.
 */
commands = [
    new RPSCommand(),
    new ClearChatCmd()
];

client.on('ready', () => {
    console.log(`Bot has started with id: ${client.user.tag}`);
});

client.on('message', async message => {
    if (message === '' || message === 'undefined') return;
    commands.forEach(command => {
        if (command.isAllowed(message.member, message.author.bot)) {
            var args = command.isCommand(message.content.trim().split(/ +/)[0]);
            if (args != null) {
                command.runCommand(message, args);
                return;
            } else {
                console.log("Command not found for '" + message.content + "'.");
            }
        } else {
            if (!message.author.bot) {
                message.reply("Insufficient Permission!");
            }
        }
    });
});

/**
* Login.
*/
client.login(process.env.DISCORD_TOKEN);