const mongo = require('mongodb').MongoClient
const { mongoDbUri } = process.env.MONGODB_URI || require('../data/secret')

async function getRandomQuote(quotesCollection) {
  return new Promise((resolve, reject) => {
    quotesCollection
      .aggregate(
        [
          { $match: { tweeted: false } }, // registered non-tweeted tweets
          { $sample: { size: 1 } } // only one
        ]
      )
      .toArray(
        (err, docs) => err ? reject(err) : resolve(docs[0])
      )
  })
}

async function updateTweetedStatus(quotesCollection, { _id }) {
  return quotesCollection.update(
    { _id },
    { $set: { tweeted: true } }
  )
}

async function getQuotesCollection() {
  const database = await mongo.connect(mongoDbUri)
  return database
    .db('im-to-lazy-to-tweet-db')
    .collection('quotes')
}

module.exports = {
  getRandomQuote,
  updateTweetedStatus,
  getQuotesCollection
}
