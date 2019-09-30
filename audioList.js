const fs = require('fs');
const testFolder = './audioFiles';

function populate(lista) {
    var audioTitle;
    var regex = new RegExp("\.mp3");
    var filesArray = fs.readdirSync(testFolder);
    filesArray.forEach(function (file) {
        if (regex.test(file)) {
            audioTitle = testFolder + '/' + file;
            lista.push(audioTitle);
        }
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
}

function getRandomItem(arr) {
    return Math.floor(Math.random() * arr.length)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(lista) {
    while (true) {
        var time = getRandomInt(1000, 4000);
        var index = getRandomItem(lista);
        await sleep(time);
        console.log(lista[index]);
    }
}

var mutex = true;
function sendAudio(index, stream, audioList) {
    audioStream = fs.createReadStream(audioList[index]);
    console.log("Now playing: " + audioList[index]);
    audioStream.pipe(stream, { end: false });

    //stream('done'), for some reasons, is called one time for every mp3 piped to the stream so it is exponential (??)
    //there is a simple mutex to let one process at the time in. I'm trying to find another solution but for now it seems to work fine

    stream.on('done', async function () {
        if (mutex) {
            mutex = false;
            var time = getRandomInt(2000, 4000);
            var indice = getRandomItem(audioList);
            await sleep(time);

            mutex = true;
            sendAudio(indice, stream, audioList);
        }
    });
}

function sendSaluto(stream) {
    audioStream = fs.createReadStream("./audioFiles/CONFERENZAUBI.mp3");
    audioStream.pipe(stream, { end: false });
    console.log("ciao!");
}


module.exports = {
    populate,
    getRandomInt,
    getRandomItem,
    sleep,
    sendAudio,
    sendSaluto,
    test
};










