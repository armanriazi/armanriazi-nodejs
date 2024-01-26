const express = require("express");
const Order = require("./Order");
const app = express();
const port = 5000;

app.use(express.json());

app.post("/order", (req, res) => {
  const order = req.body;
  const newOrder = new Order(order);
  console.log(newOrder.delivery);
  console.log(newOrder.order_details);
  res.send("Order received");
});

app.listen(port, () => console.log("Server running"));
