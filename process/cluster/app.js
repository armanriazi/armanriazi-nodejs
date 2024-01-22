const app = require("express")();
const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;

//When we start the app,it will start a cluster of processes, after that,anytime someone makes a request to the server,the parent process will redirect the request to a child process
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < 6; i++) {
    //spawns child processes/instance
    cluster.fork();
  }

  cluster.on("online", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Starting a new order");
    cluster.fork();
  });
} else {
  //workers will share the same TCP connection on the same port
  const express = require("express");
  const app = express();

  app.get("/heavy", (req, res) => {
    let counter = 0;
    while (counter < 90000000) {
      counter++;
    }
    console.log(`Heavy request ${process.pid}`);
    res.send(`${process.pid} completed,counter is:${counter}`);
  });

  app.get("/light", (req, res) => {
    res.send("From light");
  });
  app.listen(6000, () => {
    console.log("listening to port 6000");
  });
}


