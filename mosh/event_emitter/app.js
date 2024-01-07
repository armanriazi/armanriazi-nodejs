const EventEmitter = require('events')

const Logger = require('./logger')
const lg = new Logger()

// Register a listener
lg.on('messageLogged', (arg) => {
  console.log('Listener called', arg)
})
lg.log('message')
