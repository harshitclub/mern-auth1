const User = require('../model/User') // importing the userSchema
const bcrypt = require('bcryptjs') // bcrypt is the module that is used to hashing the password
const jwt = require('jsonwebtoken') // jswt for generating the token when user logged in


const JWT_SECRET_KEY = "MyKey"

// signup function for registering the user in the databse
const signup = async(req, res, next)=>{
    const {name, email, password} = req.body; // destructuring

    let existingUser; // creating the validation for already registered user
    try{
        existingUser = await User.findOne({email:email}) //findOne is to check the already registered emails
    }catch(err){
        console.log(err)
    }
    if(existingUser){
        return res.status(400).json({message:"User Already Registered! Login Instead"}) // Show this message if user already registered
    }

    const hashedPassword = bcrypt.hashSync(password); // this is used the hash the password that is sent to the mongodb database so the password is secure

    const user = new User({ // function for registering the new user in the mongoDB database
        name, 
        email, 
        password:hashedPassword,
    })

    try{ // saving the user data by .save() function - this function is used for saving the data in the mongodb database
        await user.save();
    }catch(err){
        console.log(err)
    }

    return res.status(201).json({message:user})  // return this message or status when the user is successfully registered in the mongodb
}

// login function for login the user on our application

const login = async(req, res, next)=>{
    const {email, password} = req.body; // destructuring
    let existingUser;
    try{
        existingUser = await User.findOne({email:email}) //findOne is to check the already registered emails
    }catch(err){
        return new Error(err); // return the new error if email does not found
    }

    if(!existingUser){
        return res.status(400).json({message:"User Not Found! SignUp First"}) // condition to check the user is registered or not
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password) // comparing the password
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Email or Password!"}) // condition to check the password is correct or not
    }
    const token = jwt.sign({id: existingUser._id}, JWT_SECRET_KEY, {
        expiresIn:"1hr"
    })

    res.cookie(String(existingUser._id), token, { // creating the cookie after the token is created
        path:'/',
        expires: new Date(Date.now()+1000*3000),
        httpOnly: true,
        sameSite:"lax"
    })

    return res.status(200).json({message:"Logged In Successfully!", user: existingUser, token})
}

const verifyToken=(req, res, next) =>{ // function to verify the token of the user
    const cookies = req.headers.cookie; // getting the token from the cookies
    const token = cookies.split("=")[1]; // after getting the token from cookie, we split this into 2 parts
    if(!token){ // if token not found showing this message
        res.status(404).json({message:"No Token Found!"})
    }
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(400).json({ message: "Invalid Token" });
        }
        req.id = user.id;
    })
    next();
}

const getUser = async(req, res, next) => { // function to get the details of the user from the generated id
    const userId = req.id;
    let user;
    try{
        user = await User.findById(userId, "-password");
    }catch(err){
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json({user})
}



exports.signup = signup  // exporting this signup function
exports.login = login // exporting this login function
exports.verifyToken = verifyToken // exporting the function that is used to verify the token
exports.getUser = getUser // exporting the function that is used to get the information of our user