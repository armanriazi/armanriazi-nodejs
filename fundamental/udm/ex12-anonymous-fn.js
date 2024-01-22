/*
//**DOC
Anonymous functions/Function expressions are not hoisted so you can only call them after their declaration. 
Named functions/Function declarations are hoisted (interpreter moves the declaration to the top). 
You can call them before they are declared I Anonymous functions/function expressions do not have a name.
Named functions/Function declarations have a name. 
*/

/*
test();
var test= function(){
    console.log("Hello");
}
// TypeError
*/

function message() {
    let msg = "Friday is going to be rainy"; 
    let type = {
        radio: "radio message", tv: "TV message"
    }; 

    function date() {
        return new Date().toString(); 
    }

    function weatherForecast(){
        console.log(msg); 
        console. log(type. radio); 
        console.log(date()); 
    }
return weatherForecast; 
}

let weather = message(); 

weather(); 

