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



module.exports = {
    populate,
    getRandomInt,
    getRandomItem,
    sleep,
    test
};










