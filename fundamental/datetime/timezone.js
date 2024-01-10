const moment = require('moment-timezone');


moment.tz.setDefault('America/Los_Angeles'); 
let targetTimezone; 
var args = process.argv; 

console.log("number of arguments is "+args.length); 
if (args.length != 3) { 
    console.log("Usage: node <script-file> <timezone>"); 
    process.exit(1); 
}
else {
     targetTimezone = process.argv[2]; 
    }
    
console.log(`The time at/the ${targetTimezone} is ${moment().tz(targetTimezone).format()}`);

