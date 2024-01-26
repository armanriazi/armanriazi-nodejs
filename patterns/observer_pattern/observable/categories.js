const EventEmitter = require("events").EventEmitter;

class Category extends EventEmitter {
  constructor(category_name) {
    super();
    this.category_name = category_name;
    this.discount_amount = 0;
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs != observer);
  }

  discount(discount_amount) {
    this.discount_amount = discount_amount;
    //create emitter called discount and send message to observers
    this.observers.forEach((observer) => {
      this.emit(
        "discount",
        `${observer.client_name} there is ${this.discount_amount}% discount on ${this.category_name}`
      );
    });
  }

  noDiscount() {
    //remove the observer from subscribers
    this.observers.forEach((observer) => {
      this.emit(
        "nodiscount",
        `${observer.client_name} discount on ${this.category_name} is over`
      );
    });
  }
}

module.exports = Category;
