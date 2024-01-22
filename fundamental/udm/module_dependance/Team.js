const getUser = require("./User");
console.log("from team");
console.log(getUser); //If User.js is run we get: Accessing non-existent property 'Symbol(nodejs.util.inspect.custom)' of module exports inside circular dependency

function getTeam() {
  return "coders";
}
//module.exports = getTeam; //to solve the error of circular, move it at the first line
