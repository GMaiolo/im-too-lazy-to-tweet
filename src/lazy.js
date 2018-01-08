const quotes = require('../data/quotes.json')
const { wasAlreadyTweeted, randomBetween } = require('./utils')
const twit = require('./utils').session()
const maxTweetDelay = 120 * 60 * 1000 // min * sec * ms

exports.tweetSomething = async function init() {
  const status = await findUnusedTweet()
  const tweetDelay = ~~(Math.random() * maxTweetDelay)
  console.info(`## Tweeting the following quote in ${~~(tweetDelay / 60 / 1000)} minutes ##`)
  console.info(`${status}\n`)
  // tweeting!
  setTimeout(() => {
    twit.post('statuses/update', { status })
  }, tweetDelay)
}

async function findUnusedTweet() {
  const owner = process.env.NODE_ENV === 'PROD' 
    ? process.env.OWNER 
    : require('../data/secret').owner
  const randomQuoteIndex = randomBetween(0, quotes.length - 1)
  const text = quotes[randomQuoteIndex]
  const retry = await wasAlreadyTweeted(text, owner)
  if (retry) {
    console.log('[[ The following quote was already tweeted, will retry ]]')
    console.log(`${text}\n`)
  }
  return retry ? findUnusedTweet() : text
}
