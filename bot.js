const prefix = "!"; // Set bot prefix here

const fs = require('fs');
const test = require('./audioList');
const auth = require("./auth.json"); // Load token
const Discord = require("discord.io"); // Load discord.io

const bot = new Discord.Client({ // Load bot
    token: auth.token,
    autorun: true
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
                bot.joinVoiceChannel(command[1], async function (error, events) {
                    if (error) return console.error(error);
                    bot.getAudioContext(command[1], async function (error, stream) {
                        if (error) return console.error(error);

                        test.sendSaluto(stream);
                        var time = test.getRandomInt(10000, 11000);
                        var index = test.getRandomItem(audioList);
                        await sleep(time);

                        test.sendAudio(index, stream, audioList);
                    });
                });
        }
    }
});

bot.on("disconnect", function () { // Occasionally the bot disconnects.
    bot.connect(); // Just reconnect when that happens.
});


