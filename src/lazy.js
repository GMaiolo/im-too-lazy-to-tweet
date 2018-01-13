const { msToMinutes } = require('./utils')
const {
  getQuotesCollection,
  updateTweetedStatus
} = require('./dbHelper')
const {
  findUnusedTweet,
  getTweetDelay,
  getTwitInstance
} = require('./twitHelper')

const twit = getTwitInstance()

exports.tweetSomething = async function init() {
  const quotesCollection = await getQuotesCollection()
  const quote = await findUnusedTweet(quotesCollection)
  const tweetDelay = getTweetDelay()
  console.info(`Tweeting in ${msToMinutes(tweetDelay)} minutes...\n${quote.text}\n`)
  // tweeting!
  setTimeout(() => {
    twit.post('statuses/update', { status: quote.text })
    updateTweetedStatus(quotesCollection, quote)
  }, tweetDelay)
}
