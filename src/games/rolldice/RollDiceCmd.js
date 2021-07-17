const { Command } = require("../../commands/manager/CommandManager.js");
const category = require("../../commands/manager/CommandCategory");

let emojiNumbers = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣"
];
let expirationTime = 25;
let rollMessage = null;

class RollDiceCommand extends Command {

    constructor() {
        super([category.GAME, "dice", null, false, true]);
    }

    async onCommand(message, args) {
        rollMessage = await message.channel.send("The Dice will roll, choose a number below.");

        for (let i = 0; i < emojiNumbers.length; i++) {
            await rollMessage.react(emojiNumbers[i]);
        }

        setTimeout(() => {
            let index = Math.floor(Math.random() * emojiNumbers.length);
            let emoji = emojiNumbers[index];

            let msg = [];
            msg.push("Winners:");

            let reaction = rollMessage.reactions.cache.find(reaction => reaction.emoji.name === emoji);

            if ((reaction.users.cache.size-1) >= 1) {
                msg.push(reaction.users.cache.filter(user => !user.bot).mapValues(m => m.username).array().join(','));
            } else {
                msg.push("No winners detected!");
            }
            msg.push("Number was " + emoji + "!");

            message.channel.send(msg);
            rollMessage = null;
        }, expirationTime);

        // roll.awaitReactions((reaction, user) => {
        //     return !user.bot;
        // }, { max: 1000, time: expirationTime, errors: ['time'] })
        //     .catch(() => {
        //         let index = Math.floor(Math.random() * emojiNumbers.length);
        //         let emoji = emojiNumbers[index];
        //
        //
        //         message.channel.send("Winners: ");
        //
        //         let reaction = roll.reactions.cache.find(reaction => reaction.emoji.name === emoji);
        //         reaction.users.cache.map(m => {
        //             message.channel.send(m.username);
        //         })
        //
        //         message.channel.send("Number was: '" + index + ", " + emoji);
        //     });
    }

    async onReactionAdd(reaction, user) {
        if (reaction.message !== rollMessage) return;
        if (!hasEmoji(reaction.emoji.name)) {
            await reaction.users.remove(user);
            return;
        }

        let message = reaction.message;
        let count = 0;
        message.reactions.cache.map(r => {
            // if (r === reaction) return;
            // r.users.remove(user);
            if (r.users.cache.has(user.id)) {
                count+=1;
            }
        });

        if (count > 1) {
            await reaction.users.remove(user);
        }
    }
}

/**
 * Check if the given emoji is a
 * number between 1 to 6.
 *
 * @param {String} emoji
 * @return {boolean}
 */
function hasEmoji(emoji) {
    return typeof emojiNumbers.find(i => i === emoji) !== 'undefined';
}

// ----------
// Export section
// ----------
module.exports = RollDiceCommand;