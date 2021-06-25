const { Command, dmChannel } = require("../../commands/manager/CommandManager.js");
const category = require("../../commands/manager/CommandCategory");

let rock = '🤜';
let paper = '🤚';
let scissor = '✌';

let playMap = new Map();

class Play {
}

class RPSCommand extends Command {

    constructor() {
        // Command: /play rps <user?bot>
        super([category.GAME, "rps", null, false, true]);
    }

    async onCommand(message, args) {
        let secondPlayer = await message.mentions.users.first();

        if (secondPlayer != null) {
            if (secondPlayer.bot) {
                await message.channel.send("Leave mention blank to challenge a bot.");
                return;
            }

            // For test purpose this will be disabled.
            // if (secondPlayer.id === message.author.id) {
            //     message.reply("You should mention someone else.");
            //     return;
            // }
            secondPlayer.send(
                [
                    message.author.username + " has challenge you in a Rock-Paper-Scissors battle!",
                    "Pick your shape below:"
                ])
                .then(react => {
                    react.react(rock);
                    react.react(paper);
                    react.react(scissor);
                })
                .catch(() => message.channel.send(secondPlayer.username + "'s DM is closed."));
        } else {
            if (args.length > 0) {
                await message.channel.send("User not found!");
                return;
            }
        }

        await message.channel.send("Heyo, Let's play some RPS?");
        await message.author.send([
            "You have started a Rock-Paper-Scissors battle against " + (!secondPlayer ? "SkyBot" : secondPlayer.username) + "!",
            "Pick your shape below:"
        ])
            .then(react => {
                react.react(rock);
                react.react(paper);
                react.react(scissor);
            })
            .catch(() => message.channel.send("You have DM closed!"));
    }

    async onReactionAdd(reaction, user) {
        if (reaction.message.channel.type === dmChannel) {
            console.log("DM Check!!");
        } else {
            console.log("Noup, not DM my dear.");
        }
        console.log("User: '" + user.username + "' has added a new reaction: '" + reaction + "'");
    }
}

// ----------
// Export section
// ----------
module.exports = RPSCommand;