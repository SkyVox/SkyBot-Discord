const RPSCommand = require("../../games/rockpaperscissors/RPSCmd");
const RollDiceCommand = require("../../games/rolldice/RollDiceCmd")
const ClearChatCmd = require("../ClearChatCmd");

let prefix = '!'; // To make mentions easier let's use "!".

/**
 * Commands and fun parties.
 */
commands = [
    new RPSCommand(),
    new RollDiceCommand(),
    new ClearChatCmd()
];

async function handleCommand(message) {
    if (message == null || message.content === 'undefined') return;

    let content = message.content;
    if (!content.startsWith(prefix)) return;

    let args = content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().trim().toLowerCase();
    let subCommand = args.length > 0 ? args.shift().trim().toLowerCase() : null;

    for (let i in commands) {
        if (!commands.hasOwnProperty(i)) continue;
        let command = commands[i];

        if (!command.isCommand(cmd)) continue;
        if (command.hasSubCommand()) {
            if ((subCommand == null) || (command.command !== subCommand)) {
                continue;
            }
        }

        if (!command.isAllowed(message.member, message.author.bot)) {
            sendMessage(message, "You don't have enough permission to execute that command!", message.author.bot);
            continue;
        }

        await command.onCommand(message, args.join(' '));
        return;
    }

    // We could not find the command that this user submitted.
    message.channel.send("Could not find this command. Use `!help` to check all available commands!");
}

async function handleReaction(reaction, user) {
    if (user.bot) return;

    for (let i in commands) {
        if (!commands.hasOwnProperty(i)) continue;
        let command = commands[i];
        if (!command.useReaction) continue;
        await command.onReactionAdd(reaction, user);
    }
}

function sendMessage(message, text, bot) {
    if (!bot) message.reply(text);
}

module.exports = {
    handleCommand: handleCommand,
    handleReaction: handleReaction
}