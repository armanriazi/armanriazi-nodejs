const app = require("express")();
const { fork } = require("child_process");

app.get("/heavy", (req, res) => {
  //spawn a new Node.js process/instance
  var child = fork(__dirname + "/count.js");
  //once the child operation is finished send the data to user
  child.on("message", (myCount) => {
    console.log("Sending /heavy result"); // when the loop of count was ended
    res.send(myCount);
  });
  //send message to the child signaling that it needs to start the heavy operation
  child.send("START_COUNT");
});
// **light request will not block while heavy is running**
app.get("/light", (req, res) => {
  res.send("Hello from light ");
});

app.listen(5000, () => console.log("Server running on port: 5000"));
