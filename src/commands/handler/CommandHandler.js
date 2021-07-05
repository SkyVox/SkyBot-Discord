const RPSCommand = require("../../games/rockpaperscissors/RPSCmd");
const ClearChatCmd = require("../ClearChatCmd");

let prefix = '!'; // To make mentions easier let's use "!".

/**
 * Commands and fun parties.
 */
commands = [
    new RPSCommand(),
    new ClearChatCmd()
];

async function handleCommand(message) {
    if (message == null || message.content === 'undefined') return;
    let content = message.content;
    if (!content.startsWith(prefix)) return;

    let args = content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().trim().toLowerCase();

    for (let i in commands) {
        if (!commands.hasOwnProperty(i)) continue;
        let command = commands[i];
        let bot = message.author.bot;

        if (!command.isCommand(cmd)) continue;
        if (command.hasSubCommand()) {
            let subCommand = command.hasSubCommand() && args.length > 0 ? args.shift().trim().toLowerCase() : null;

            /**
             * TODO: If 'subCommand is null' or 'command#command is not equals subCommand' ->
             *  Build an embed with some command that could help this user.
             */
            if (subCommand == null) {
                message.reply("Missing arguments: '" + command.command + "'!");
                continue;
            } else if (command.command !== subCommand) {
                message.reply([
                    "The given argument is not valid!",
                    "You mean: '" + command.command + "'?"
                ]);
                continue;
            }
        }

        if (!command.isAllowed(message.member, bot)) {
            sendMessage(message, "You don't have enough permission to execute that command!", bot);
            continue;
        }

        await command.onCommand(message, args.join(' '));
    }
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