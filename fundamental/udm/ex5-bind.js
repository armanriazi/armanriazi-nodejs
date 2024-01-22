let dog = { 
    dog_name: "chicko", 
    bark() { 
    console.log(`${this.dog_name} says woof woof`); 
    },
};
//console.log(dog.bark());
var func = dog.bark; 
func = func.bind(dog); //uncomment -> undefined result

//console.log(func());

setTimeout(func, 1000);
