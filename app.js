const DISCORD = require("discord.js");
const client = new DISCORD.Client();
const token = require("./token.js");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.includes("documentation")) {
        msg.reply([
            "Yes.",
            "Use the link below",
            "Docs: https://discordjs.guide/"
        ]);
    }
})

client.login(token);