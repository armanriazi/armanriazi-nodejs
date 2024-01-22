class Product {
    total;
    price;
  
    constructor(total, price) {
      this.total = total;
      this.price = price;
    }
  
    get stock() {
      if (this.total > 0) {
        return "In Stock";
      } else {
        return "Not in Stock";
      }
    }
  
    sell() {
      this.total -= 1;
    }
  }
  
  const pen = new Product(3, 2);
  pen.sell();
  var stock = pen.stock;
  console.log(stock);
  console.log(pen.total);
  pen.sell();
  pen.sell();
  console.log(pen.stock);
  console.log(pen.total);
  