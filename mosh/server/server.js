const http = require('http')
//req: https://nodejs.org/dist/latest-v18.x/docs/api/http.html#class-httpincomingmessage
//res: https://nodejs.org/dist/latest-v18.x/docs/api/http.html#http_class_http_serverresponse
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(200, { 'Content-type': 'text/html' })
  
  const q = req.url
  console.log(q)

  if (req.url === '/') {
    res.write('<b>Hello World</b>')
    res.end('</br>Good bye')
  }

  if (req.url === '/api/courses') {
    res.write(JSON.stringify([1, 2, 3]))
    res.end()
  }
})

server.listen(3000)
console.log('Listening on port 3000...')
