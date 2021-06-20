const { Command } = require("./CommandManager.js");

/**
 * TEST.
 */

module.exports = class ClearChatCmd extends Command {

    constructor() {
        super(["clear", ["a"], null, false]);
    }

    async runCommand(message, args) {
        message.channel.bulkDelete(100, "Deleted");
        message.channel.send("Chat Cleared by <@" + message.member.id + ">!");
    }
}