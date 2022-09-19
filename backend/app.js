const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/userRoutes")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();

app.use(cookieParser())
app.use(cors({credentials:true, origin:"http://localhost:3000"}))

app.use(express.json())  // express.json is for saving or showing the data in the json format to user
app.use('/api', router);


//mongoose is use to connect the node or express to the mongodb database
mongoose.connect("mongodb+srv://admin:password@cluster0.dpc3s0b.mongodb.net/auth?retryWrites=true&w=majority").then(()=>{
    app.listen(5000);
    console.log("Database is Connected Successfully!")
}).catch((err)=>{
    console.log(err) // catching the error if there is any
})

//admin
//Harshit7505