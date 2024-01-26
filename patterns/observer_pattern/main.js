const Client = require("./observer/client");
const Category = require("./observable/categories");

//create 2 new categories
const laptops = new Category("laptops");
const headphones = new Category("headphones");

//create new users
const adam = new Client("Adam");
const john = new Client("John");

laptops.subscribe(adam); //subscribe adam to laptops category
laptops.subscribe(john); //subscribe john to laptops category

//listen to discount and nodiscount events on laptops
laptops.on("discount", (res) => console.log(res));
laptops.on("nodiscount", (res) => console.log(res));

//fire the discount emitter on laptops
laptops.discount("12");

laptops.unsubscribe(john); // john is not interested in laptops anymore

headphones.subscribe(john); //subscribe john to headphones category

//listen to discount and nodiscount events on headphones
headphones.on("discount", (res) => console.log(res));
headphones.on("nodiscount", (res) => console.log(res));

headphones.discount("20");

laptops.noDiscount(); // remove discount on laptops

headphones.discount("30"); // add more discount on headphones

headphones.noDiscount(); // remove discount on headphones
