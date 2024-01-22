function counter() {
     for (var i = 1; i <= 3; i++); 
     { 
        console.log(`i is ${i} outside of setTimeout`); 
        setTimeout(function () {
          console.log(i);           
        }, i * 1000); 
     }
}

counter(); // 4

