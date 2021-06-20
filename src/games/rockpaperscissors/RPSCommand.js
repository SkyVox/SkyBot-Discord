const { Command } = require("../../commands/CommandManager.js");

module.exports = class RPSCommand extends Command {

    constructor() {
        super(["sb", ["test", "bot"], null, false]);
    }

    async runCommand(message, args) {
        message.channel.send("Called the RPS Cmd!");
    }
}