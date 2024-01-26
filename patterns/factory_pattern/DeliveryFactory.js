const Bicycle = require("./Bicycle");
const MotorScooter = require("./MotorScooter");

/// #Important: `details.tip` A new property/function needs to be added to all the classes without code duplication(this way, we don't' enter a new property or function to each class separately). 

class DeliveryFactory {
  create = (details) => {
    let delivery;

    if (details.delivery_method == "bicycle") {
      delivery = new Bicycle(details);
    }
    if (details.delivery_method == "motorscooter") {
      delivery = new MotorScooter(details);
    }

    delivery.tip = details.tip; 
    return delivery;
  };
}

module.exports = DeliveryFactory;
