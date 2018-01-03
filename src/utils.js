const axios = require('axios')
const cheerio = require('cheerio')
const Twit = require('twit')

exports.randomBetween = function(min, max) {
  return Math.floor(Math.random() * max) + min
}

exports.session = function getTwitSession() {
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

exports.wasAlreadyTweeted = async function wasAlreadyTweeted(text, owner) {
  const searchUrl = 'https://twitter.com/search'
  const params = { q: `${text} from:${owner}` }
  const res = await axios.get(searchUrl, { params })
  const mainSelector = '#stream-items-id .content'
  return !!cheerio.load(res.data)(mainSelector).html()
}

exports.searchTweet = async function searchTweet(text, owner) {
  const searchUrl = 'https://twitter.com/search'
  const params = { q: `${text} from:${owner}` }
  const res = await axios.get(searchUrl, { params })
  const mainSelector = '#stream-items-id .content'
  const $content = cheerio.load(res.data)(mainSelector)
  if (!$content.html()) return { 
    query: params.q, 
    status: 404
  }
  return {
    query: params.q,
    status: 200,
    owner,
    date: $content
      .find('._timestamp.js-short-timestamp')
      .html(),
    text: cheerio.load(
        $content
          .find('.js-tweet-text.tweet-text')
          .html()
          .replace(/<strong>|<\/strong>/g, '')
      ).text()
  }
}
