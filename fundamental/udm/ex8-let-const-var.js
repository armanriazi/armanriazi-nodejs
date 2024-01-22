/*
//**DOC
No, let and const are hoisted to the top of the block they are in but not initialized to the default undefined value 
so we can not use them until they are declared. If we do, RerefenceError is brown. 
Variables declared using var can be accessed before they are declared and are equal to undefined. 
Remember hoisting means declarations are moved to the top of their scope not the initialization. 
Another rule is that unlike var, a let variable cannot be re-declared within its scope. 
*/
{
//let f= "Arman";
//const l= "Riazi";
var m="No";
}

//console.log(f);//Invalid
//console.log(l); //Invalid
console.log(m);