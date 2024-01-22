const student = { 
    first_name: "John",
    talk() { 
        console.log(this.first_name, "talks"); 
    }
}; 
const teacher = { 
    first_name: "Adam", 
}; 

const bound=student.talk.bind(teacher) 

bound()