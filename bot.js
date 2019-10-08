require('dotenv').config();

const prefix = "!"; // Set bot prefix here
const choiceGeneralID = process.env.GENERAL_CHANNEL_ID; // hard coded the ID of the "general" text channel of antiChoice. 
// TODO: bot looks for channel named "general" and texts to it

const fs = require('fs');
const test = require('./audioList');
const reddit = require('./redditScraper');
const auth = require("./auth.json"); // Load token
const Discord = require("discord.io"); // Load discord.io

const bot = new Discord.Client({ // Load bot
    token: auth.token,
    autorun: true
});

reddit.fetchArticles('TheRedPill');
reddit.fetchArticles('Steak');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startMessaging(channelID) {
    bot.sendMessage({
        to: channelID,
        message: reddit.fetchArticleUrl()
    });
}

var audioList = [];
bot.on("ready", function () {
    console.log("I'm online!");
    test.populate(audioList);
});

bot.on("message", function (user, userID, channelID, message, event) {
    if (message.startsWith(prefix)) {
        let command = message.slice(prefix.length).split(" ");
        switch (command[0]) {
            case "test":
                if(preferredChannelID == null) {
                    preferredChannelID = channelID;
                }
                var requestedChannelId = command[1];
                bot.joinVoiceChannel(requestedChannelId, async function (error, events) {
                    if (error) return console.error(error);
                    bot.getAudioContext(requestedChannelId, async function (error, stream) {
                        if (error) 
                            return console.error(error);

                        test.sendSaluto(stream);
                        var time = test.getRandomInt(10000, 11000);
                        var index = test.getRandomItem(audioList);
                        await sleep(time);

                        test.sendAudio(index, stream, audioList);
                    });
                });
                break;
            case "message":
                startMessaging(choiceGeneralID);
        }
    }
});

bot.on("disconnect", function () { // Occasionally the bot disconnects.
    bot.connect(); // Just reconnect when that happens.
});