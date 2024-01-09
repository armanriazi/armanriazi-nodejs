const http = require('http')
const request = http.request({
  port: 3000,
  host: '127.0.0.1',
  method: 'GET',
  path: '/'
})
request.end()

request.on('response', function (response) {
  response.on('end', function () {
    if (response.statusCode == 201) {
      console.log('Connection Created')
    } else {
      console.log('Connection failed to create')
    }
  })
})
