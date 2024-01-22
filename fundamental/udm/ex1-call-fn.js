const student = {
    first_Name: "John",
    getName() { return this .first_Name}     
}
const getName = student .getName;
console.log(student.getName());  //syntax of getName() //undefined
    
    