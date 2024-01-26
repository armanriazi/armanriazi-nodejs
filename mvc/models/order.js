const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderName: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("detail", orderSchema);
module.exports = Order;
