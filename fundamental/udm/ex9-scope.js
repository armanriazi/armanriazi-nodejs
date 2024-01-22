let x = 20; 
console.log(x); //20 
function test() { 
    
    var x = 30; 
    console. log(x); //30

 if (true) { 
    var x = 40; 
    console.log(x); //40
 }
    console.log(x); //40
}

test(); 
console.log(x); //20

