const { Command } = require("./manager/CommandManager.js");
const category = require("./manager/CommandCategory");
let maxValue = 250;

/**
 * TEST.
 */

module.exports = class ClearChatCmd extends Command {

    constructor() {
        super([category.CLEAR, null, null, false]);
    }

    async runCommand(message, args) {
        let deleteAmount = 100;

        if (args !== '') {
            let value = args.split(' ')[0];
            if (value == parseInt(value, 10)) {
                deleteAmount = Math.ceil(Number.parseInt(value));
                if (deleteAmount > maxValue) deleteAmount = maxValue;
            } else {
                message.channel.send("Value '" + value + "' is not a valid integer.");
                return;
            }
        }

        message.channel.bulkDelete(deleteAmount, "Deleted");
        if (!args.includes("-silent")) {
            let mention = '<@' + message.member.id + '>';
            message.channel.send(mention + " has deleted " + deleteAmount + "!");
        }
    }
}