const DeliveryFactory = require("./DeliveryFactory");

class Order {
  constructor(order) {
    this.order_details = order.order_details; // array of details
    const deliveryFactory = new DeliveryFactory();
    //DeliveryFactory class returns instance related to the passed in delivery method by the client
    this.delivery = deliveryFactory.create(order.delivery_details);

  
    return this;// Because of using ret this, we will also have tips property.
  }
}

module.exports = Order;
