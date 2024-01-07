const EventEmitter = require('events')
const url = 'http://mylogger.io/104'
class Logger extends EventEmitter {
  // Send an HTTP request
  log (message) {
    // Send HTTP request
    console.log(message)
    // Rise an event
    this.emit('messageLogged', { id: 1, url: 'http://' })
  }
}
module.exports = Logger
