const student = { 
    name: "Jason", 
    siblings: ["Adam", "Smith "], 
    showSiblings() { 
        //["Adam", "Smith "].forEach() //Valid
        this.siblings.forEach( (sibling)=> { // using syntax function(sibling)  `undefined` 
            console.log(`${this.name}'s sibling is ${sibling}`);
        }); 
    }
}; 
 student.showSiblings(); 

