const { msToMinutes } = require('./utils')
const { getQuotesCollection } = require('./dbHelper')
const {
  findUnusedTweet,
  getTweetDelay,
  getTwitInstance
} = require('./twitHelper')

const twit = getTwitInstance()

exports.tweetSomething = async function init() {
  const quotesCollection = await getQuotesCollection()
  const status = await findUnusedTweet(quotesCollection)
  const tweetDelay = getTweetDelay()
  console.info(`Tweeting in ${msToMinutes(tweetDelay)} minutes...\n${status}\n`)
  // tweeting!
  setTimeout(() => {
    twit.post('statuses/update', { status })
  }, tweetDelay)
}
