const express = require("express");
const app = express();
const port = 5000; 
const ejs = require("ejs");
const path = require("path");
// 1ocalhost.5000/ app.get("/", (req, res) .> { res.send("Hi from an Express app"); }); 

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(port,()=>{
     console.log("Server is running") 
 }); 

 app.get("/user/:user_name", (req,res) => {
    //res.render("index", {username: req.params.user_name})
    res.send("Hi from Ex");
 });

 app.get("/*", (req,res) => {   
   //res.status(404).send("Not found");
   res.sendStatus(404);
});

 app.get("/", (req,res) => {
    res.send("Hi from Ex");
 });
 
 app.get("/test", (req,res) => {
    res.send("<h1>Hi from Ex</h1");
 });



 //localhost:5000/user?id=20
 app.get("/user", (req,res) => {
    res.send(req.query.id);
    res.send("This is a user root");
 });

 // localhost:5000/account/222
 app.get("/account/:number", (req,res) => {
    let numb = +req.params.number;
    if(isNaN(numb)){
    return res.send("Server sending message");
    }
    res.send("Number sent"  + numb);
 });