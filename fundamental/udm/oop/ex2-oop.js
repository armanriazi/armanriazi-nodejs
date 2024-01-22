function User(age, name) {
    this.age = age;
    this.name = name;
  }
  
  User.prototype.getDetails = function () {
    return `${this.age}, ${this.name}`;
  };
  
  const tom = new User(30, "Tom");
  let details = tom.getDetails();
  console.log(details); // 30, Tom
  