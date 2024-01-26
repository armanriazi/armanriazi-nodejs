var http = require("http");
var fs = require("fs");

var server = http.createServer((req, res) => {
  //Most browsers make and additional request for the favicon.ico so we want to run the code if the request isn't for favicon.ico , if you don't add the if check,this code runs twice
  if (req.url != "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    var readStream = fs.createReadStream("assets/bigtextFile.txt");
    console.log("req made");
    //pipe, pipes/connects a readable steam to a writable, so "res" object is a writable,so we pipe readStream to res which is a writable
    readStream.pipe(res);

  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Listening to port 5000");
});
