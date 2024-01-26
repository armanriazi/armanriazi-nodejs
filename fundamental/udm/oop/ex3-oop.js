class Product {
    constructor(productName, id) {
      this.productName = productName;
      this.id = id;
    }
  }
  
  class Bag extends Product {
    constructor(productName, id, leatherType) {
      super(productName, id);
      this.leatherType = leatherType;
    }
  }
  
  const lucci = new Bag("Summer bag", 48320, "genuine leather");
  console.log(lucci);
  