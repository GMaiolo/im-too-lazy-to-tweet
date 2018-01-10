const axios = require('axios')
const cheerio = require('cheerio')
const Twit = require('twit')
const {
  getRandomQuote,
  updateTweetedStatus
} = require('./dbHelper')

const maxTweetDelay = 120 * 60 * 1000 // min * sec * ms

function getTweetDelay() {
  return ~~(Math.random() * maxTweetDelay)
}

function getTwitInstance() {
  const secret = process.env.NODE_ENV === 'PROD' ? {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    owner: process.env.OWNER,
    ownerId: process.env.OWNER_ID
  } : require('../data/secret')
  return new Twit(secret)
}

async function wasAlreadyTweeted(text, owner) {
  const searchUrl = 'https://twitter.com/search'
  const params = { q: `${text} from:${owner}` }
  const res = await axios.get(searchUrl, { params })
  const mainSelector = '#stream-items-id .content'
  return !!cheerio.load(res.data)(mainSelector).html()
}

async function findUnusedTweet(quotesCollection) {
  const owner = process.env.NODE_ENV === 'PROD'
    ? process.env.OWNER
    : require('../data/secret').owner
  const quote = await getRandomQuote(quotesCollection)
  const retry = await wasAlreadyTweeted(quote.text, owner)
  if (retry) {
    console.log(`ID: ${quote._id} was already tweeted, updating in DB`)
    updateTweetedStatus(quotesCollection, quote)
  }
  return retry ? findUnusedTweet(quotesCollection) : quote.text
}

module.exports = {
  findUnusedTweet,
  getTwitInstance,
  getTweetDelay
}