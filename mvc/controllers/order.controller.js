const Order = require("../models/order");

const getOrders = async (req, res) => {
  try {
    const savedOrders = await Order.find();
    res.render("orders", { savedOrders, title: "Order History" });
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const createNewOrder = async (req, res) => {
  const { orderName, total } = req.body;
  try {
    const order = await new Order({ orderName, total });
    await order.save();
    res.send("Order created");
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

module.exports = {
  getOrders,
  createNewOrder,
};
