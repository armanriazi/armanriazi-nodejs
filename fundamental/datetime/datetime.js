function clock() {

 let today = new Date();
  let hours = today.getHours();
   let minutes = today.getMinutes();
    let seconds = today.getSeconds();
     console.log(hours, ":", minutes, ":", seconds); 
}

setInterval(clock, 1000); 

