//module.exports.age = 12; having uncomment this line, will show this global created
const student = { name: "Jason",
 siblings: ["Adam", "Smith "], 
 showSiblings: () => { console.log(this);}
} 
student. showSiblings(); 
    
    