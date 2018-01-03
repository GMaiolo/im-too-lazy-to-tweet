const lazy = require('./src/lazy')

console.log(`\nRunning on ${process.env.NODE_ENV || 'DEV'} environment\n`)

lazy.tweetSomething()
