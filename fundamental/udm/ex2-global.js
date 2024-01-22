global.age = 34;
// global = this
function hi(){
    console.log(this.age);
}


hi();