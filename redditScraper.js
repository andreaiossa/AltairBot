require('dotenv').config();

const snoowrap = require('snoowrap');
const test = require('./audioList');

const reddit = new snoowrap({ //THESE FIELDS NEED TO BE MOVED IN ANOTHER UNTRACKED FILE!
    userAgent: 'TheDig3 bot, v1.0',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const numberOfArticles = 30;

var fetchedArticles = [];

function pickArticle() {
    let index = test.getRandomInt(0, fetchedArticles.length);
    return fetchedArticles[index].url;
}

function fetchArticleUrl() {
    return pickArticle();
}

function fetchArticles(subredditName) {
    reddit.getHot(subredditName, { limit: numberOfArticles }).then(hot => {
        hot.forEach(post => {
            let redditPost = {
                title: post.title,
                author: post.author,
                url: post.url
            };
            fetchedArticles.push(redditPost);
        })
    })
}

module.exports = {
    fetchArticleUrl,
    fetchArticles
};