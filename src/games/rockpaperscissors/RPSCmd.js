const { Command } = require("../../commands/manager/CommandManager.js");
const category = require("../../commands/manager/CommandCategory");

// Command: /play rps <user?bot>

module.exports = class RPSCommand extends Command {

    constructor() {
        super([category.GAME, "rps", null, false]);
    }

    async runCommand(message, args) {
        let secondPlayer = message.mentions.users.first();

        if (secondPlayer != null) {
            // For test purpose this will be disabled.
            // if (secondPlayer.id === message.author.id) {
            //     message.reply("You should mention someone else.");
            // }
            secondPlayer.createDM();
            secondPlayer.send(message.author.username + " has challenge you in a Rock-Paper-Scissors battle!")
                .then(() => secondPlayer.deleteDM());
        }

        message.channel.send("Called the RPS Cmd!");
        message.author.createDM();
        const embed = await message.author.send("Pick your shape!");
        await embed.react("🤜🏼");
        await embed.react("🤚🏼");
        await embed.react("✌🏼");
    }
}