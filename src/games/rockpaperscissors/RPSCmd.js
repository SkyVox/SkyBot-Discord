const { Command } = require("../../commands/manager/CommandManager.js");
const category = require("../../commands/manager/CommandCategory");

let rock = '🤜';
let paper = '🤚';
let scissor = '✌';
// Accept/Decline
let accept = '🟢';
let decline = '🔴';

let expirationTime = 60 * 1000; // 1min.

let playMap = new Map();

class Play {
    // This field hold the players.
    // users[0] = First user, who executed the command.
    // users[1] = Second user.
    users;

    oneReaction;
    twoReaction;

    // Votes list.
    votes = [];

    constructor(users) {
        this.users = users;
    }

    isReady() {
        if (this.votes.length < 2) return false;
        return !this.votes.find(vote => vote.vote === 'N');
    }

    hasEnoughReactions() {
        return this.oneReaction != null && this.twoReaction != null;
    }
}

class PlayVote {
    userName;
    vote; // 'Y' or 'N'

    constructor(userName, vote) {
        this.userName = userName;
        this.vote = vote;
    }
}

class RPSCommand extends Command {

    constructor() {
        // Command: /play rps <user?bot>
        super([category.GAME, "rps", null, false, false]);
    }

    async onCommand(message, args) {
        let authorId = message.author.id;
        let secondUser = message.mentions.users.first();

        if (secondUser != null) {
            if (secondUser.id === message.author.id) {
                await message.channel.send("You should mention someone else.");
                return;
            }

            if (secondUser.bot) {
                await message.channel.send("Leave mention blank to challenge a bot.");
                return;
            }

            let confirmMessage = await message.channel.send([
                "<@" + secondUser.id + ">, " + message.author.username + " has challenged you for a Rock-Paper-Scissors battle!",
                "Use the reactions below to accept or decline."
            ]);
            // React with the valid reactions.
            await confirmMessage.react(accept).then(() => confirmMessage.react(decline));

            // Wait for the users responses accept or decline this game.
            confirmMessage.awaitReactions((reaction, user) => {
                return [accept, decline].includes(reaction.emoji.name) && (user.id === authorId || user.id === secondUser.id);
            }, { max: 2, time: expirationTime, errors: ['time'] })
                .then(collected => {

                    // Loop through the reaction.
                    collected.map(reaction => {
                        // Get all users that have reacted with this reaction.
                        reaction.users.cache.map(user => {
                            if (user.bot) return;
                            if (user.id === authorId || user.id === secondUser.id) {
                                let play = playMap.get(authorId);
                                if (typeof play === 'undefined' || play == null) {
                                    play = new Play([ message.author, secondUser ]);
                                    playMap.set(authorId, play);
                                }

                                play.votes.push(new PlayVote(user.username, reaction.emoji.name === accept ? 'Y' : 'N'));

                                if (play.isReady()) {
                                    // Both players has accepted.
                                    startGame(play, message.channel);
                                } else {
                                    if (play.votes.length >= 2) {
                                        let users = play.votes.filter(vote => vote.vote === 'N')
                                            .map(vote => vote.userName).join(',');
                                        message.channel.send(users + " has declined!");
                                        playMap.delete(authorId);
                                    }
                                }
                            }
                        });
                    });
                })
                .catch(() => {
                    message.channel.send("Time has expired, game cancelled.");
                    playMap.delete(authorId);
                });
        } else {
            let bot = await message.client.users.fetch(process.env.BOT_ID);
            let play = new Play([ message.author, bot ]);
            startGame(play, message.channel);
        }
    }
}

let messages = {
    '0': [
        "You have started a Rock-Paper-Scissors battle against %%second-user%%!",
        "Pick your shape below:"
    ],
    '1': [
        "%%user%% has challenge you in a Rock-Paper-Scissors battle!",
        "Pick your shape below:"
    ]
};

/**
 * @param {Play} play
 * @param {TextChannel | DMChannel | NewsChannel} channel
 */
async function startGame(play, channel) {
    let filter = (reaction, user) => {
        return [rock, paper, scissor].includes(reaction.emoji.name) && (user.id === play.users[0].id || user.id === play.users[1].id);
    }

    let oneName = play.users[0].username;
    let twoName = play.users[1].username;

    for (let i = 0; i < play.users.length; i++) {
        let user = play.users[i];
        let error = false;

        if (user.bot) {
            const reactions = [ rock, paper, scissor ];
            play.twoReaction = reactions[Math.floor(Math.random() * reactions.length)];
            continue;
        }

        let message = await user.send(messages[i].map(str => str.replace("%%user%%", oneName).replace("%%second-user%%", twoName)))
            .catch(msg => {
                msg.send("User <@" + user.id + "> has DM closed!");
                error = true;
            });

        if (typeof message !== 'undefined' || message != null) {
            await message.react(rock).then(() => message.react(paper)).then(() => message.react(scissor));

            message.awaitReactions(filter, { max: 1, time: 40000, errors: ['time'] })
                .then(collected => {
                    let reaction = collected.first();

                    switch (i) {
                        case 0:
                            play.oneReaction = reaction.emoji.name;
                            break;
                        case 1:
                            play.twoReaction = reaction.emoji.name;
                            break;
                    }

                    if (play.hasEnoughReactions()) {
                        drawWinner(play, channel);
                    }
                })
                .catch(collected => {
                    channel.send("Time has expired player.one didn't react.. :(");
                });
        } else {
            error = true;
        }

        if (error) {
            playMap.delete(play.users[0].id);
            break;
        }
    }
}

/**
 * @param {Play} play
 * @param {TextChannel | DMChannel | NewsChannel} channel
 */
function drawWinner(play, channel) {
    let one = play.users[0].username;
    let two = play.users[1].username;
    let winner = getWinner(play);

    channel.send([
        "Rock-Paper-Scissors battle against '" + one + "' and '" + two + "' has end!",
        one + " picked " + play.oneReaction,
        two + " picked " + play.twoReaction,
        "```",
        winner === "TIE" ? "Both choose the same shape, it was a " + winner + "." : winner + " has won this battle.",
        "```"
        ])
        .catch(() => {
            console.log("An error has occurred! #1");
        });

    playMap.delete(play.users[0].id);
}

function getWinner(play) {
    if (play.oneReaction === play.twoReaction) return "TIE";

    let winner;
    let emoji = null;

    switch (play.oneReaction) {
        case rock:
            emoji = scissor;
            break;
        case paper:
            emoji = rock;
            break;
        case scissor:
            emoji = paper;
            break;
    }

    winner = play.twoReaction === emoji ? play.users[0].username : play.users[1].username;
    return winner;
}

// ----------
// Export section
// ----------
module.exports = RPSCommand;