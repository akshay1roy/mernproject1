const mongoose=require("mongoose")

const DB=process.env.DATABASE; // connect the .env file to DB , in DATABASE we have secure our database user name and password for security purpose.



mongoose.connect(DB).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("No connection",err)
})