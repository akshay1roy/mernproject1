
const dotenv=require("dotenv");

const express=require("express");
const app=express();
const mongoose=require("mongoose");

dotenv.config({path:'./config.env'});
require('./DB/conn')  // here we require the mongodb database form the /DB/conn file 


app.use(express.json()); // it convert the json file which is comming from the ui into the object 
app.use(require('./router/auth'));
// we link the router files to make our router easy

const PORT=process.env.PORT || 5000;   // Connect the .env file to port 



// Middleware

// const middleware=(req,res,next)=>{ 
//     console.log("Hello form middleware");
// }
// middleware();

// app.get('/',(req,res)=>{
//     res.send(`Hello world from the server`)
// })


// app.get('/about',(req,res)=>{
//     res.send(`Hello about from the server`)
// })

// app.get('/contact',(req,res)=>{
//     res.cookie("Test","thapa")
//     res.send(`Hello contact from the server`)
// })

app.get('/signin',(req,res)=>{
    res.send(`Hello Login from the server`)
})

app.get('/signup',(req,res)=>{
    res.send(`Hello Registration from the server`)
})

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})

