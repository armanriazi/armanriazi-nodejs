/*
function counter() {
    for (let i = 1; i <= 3; i++); 
    { 
       console.log(`i is ${i} outside of setTimeout`); 
    }
}

counter(); // Reference Error
*/

function counter() {
  for (var i = 1; i <= 3; i++); 
  { 
     console.log(`i is ${i} outside of setTimeout`); 
     setTimeout(()=> {
       console.log(i);           
     }, i * 1000); 
  }
}

counter(); // 4

