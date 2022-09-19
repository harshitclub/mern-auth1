const express = require('express');
const { signup, login, verifyToken, getUser } = require('../Controllers/userController');

const router = express.Router();

router.post("/signup", signup) // creating the route for the signup
router.post("/login", login) // creating the route for the login
router.get("/user", verifyToken, getUser) // creating the route for getting the user information


module.exports = router  // exporting the router