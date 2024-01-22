function countDown(callback) { 
     setTimeout(() => {
        callback("Countdown finished");
     },3000); 
}
   

countDown( (val) => console.log(val) ); 

