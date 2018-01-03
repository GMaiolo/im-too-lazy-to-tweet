const quotes = require('../data/quotes.json')
const { wasAlreadyTweeted, randomBetween } = require('./utils')
const twit = require('./utils').session()

exports.tweetSomething = async function init() {
  const text = await findUnusedTweet()
  console.info('## Tweeting the following quote ##')
  console.info(`${text}\n`)
  // tweeting!
  twit.post('statuses/update', { status: text })
    .catch(console.log)
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
