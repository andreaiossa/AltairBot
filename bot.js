const prefix = "!"; // Set bot prefix here

const fs = require('fs');
const test = require('./audioList'); s
const auth = require("./auth.json"); // Load token
const Discord = require("discord.io"); // Load discord.io
const stdin = process.stdin; // Use the terminal to run JS code

const bot = new Discord.Client({ // Load bot
    token: auth.token,
    autorun: true
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

stdin.on("data", function (input) {
    input = input.toString();
    try { // Attempt to run input
        let output = eval(input);
        console.log(output);
    } catch (e) { // Failed
        console.log("Error in eval.\n" + e.stack);
    }
});

var audioList = [];
bot.on("ready", function () { // When the bot comes online...
    console.log("I'm online!");
    test.populate(audioList);
});

var mutex = true;

function sendAudio(index, stream) {
    audioStream = fs.createReadStream(audioList[index]);
    console.log("Now playing: " + audioList[index]);
    audioStream.pipe(stream, { end: false });

    //stream('done'), for some reasons, is called one time for every mp3 piped to the stream so it is exponential (??)
    //there is a simple mutex to let one process at the time in. I'm trying to find another solution but for now it seems to work fine

    stream.on('done', async function () {
        if (mutex) {
            mutex = false;
            var time = test.getRandomInt(1000, 2000);
            var indice = test.getRandomItem(audioList);
            await sleep(time);

            mutex = true;
            sendAudio(indice, stream);
        }
    });
}


bot.on("message", function (user, userID, channelID, message, event) {
    if (message.startsWith(prefix)) {
        let command = message.slice(prefix.length).split(" ");
        switch (command[0]) {
            case "test":
                bot.joinVoiceChannel(command[1], async function (error, events) {
                    if (error) return console.error(error);

                    bot.getAudioContext(command[1], async function (error, stream) {
                        if (error) return console.error(error);

                        var time = test.getRandomInt(1000, 2000);
                        var index = test.getRandomItem(audioList);
                        await sleep(time);

                        sendAudio(index, stream);
                    });
                });
        }
    }
});




bot.on("disconnect", function () { // Occasionally the bot disconnects.
    bot.connect(); // Just reconnect when that happens.
});


