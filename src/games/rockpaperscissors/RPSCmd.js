const { Command } = require("../../commands/CommandManager.js");

module.exports = class RPSCommand extends Command {

    constructor() {
        super(["sb", ["test", "bot"], null, false]);
    }

    async runCommand(message, args) {
        message.channel.send("Called the RPS Cmd!");
        message.author.createDM;
        const embed = await message.author.send("Pick your shape!");
        await embed.react("🤜🏼");
        await embed.react("🤚🏼");
        await embed.react("✌🏼");
    }

    game() {
    }
}