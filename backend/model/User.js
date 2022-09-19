const mongoose = require('mongoose');  // importing the mongoose module

const Schema = mongoose.Schema; // importing mongoose.Schema function into the Schema variable

const userSchema = new Schema({  // creating the user schema to save the user data in the mongodb database
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: 6
    }

})

module.exports = mongoose.model('User', userSchema)  // exporting the user schema

// save as users in mongoDB Database