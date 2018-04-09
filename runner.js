const lazy = require('./src/lazy')
const cron = require('node-cron')

console.log(`\nRunning on ${process.env.NODE_ENV || 'DEV'} environment\n`)

cron.schedule('0 14 * * *', function(){
  console.log(`Running on: ${new Date()}`)
  lazy.tweetSomething()
})

