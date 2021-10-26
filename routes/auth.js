const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
require('dotenv').config()
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { request, response } = require("express");
const fetchUser = require('../middleware/fetchUser');

// Making a JWT secrete
const JWT_SECRETE = process.env.JWT_SECRETE;

// ROUTE 1: Create a user using Post "api/auth/createUser". Doesn't require auth            """" SIGN_UP """"
router.post(
  "/createUser",
  [
    body("name", "Name Must Be At Least 3 Characters Long").isLength({
      min: 3,
    }),
    body("email", "Enter A Valid Email").isEmail(),
    body("password", "Password Must Be At Least 6 Characters Long").isLength({
      min: 6,
    }),
  ],
  async (request, response) => {
    const errors = validationResult(request);

    // if there is errors, return 400 Bad Request & Errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    //Binding in try catch to prevent any possible crash
    try {
      // Check if user with this email already exist
      let user = await User.findOne({ email: request.body.email });
      if (user) {
        return response
          .status(400)
          .json({ error: "A User With This Email Already Exist!" });
      }

      // creating a secure password by hashing it with bcrypt js
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(request.body.password, salt);

      // creating user in mongo db using secure password
      user = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: securePassword,
      });

      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRETE);

      response.json({ authToken });
    } catch (error) {
      console.error(error.message);
      response
        .status(500)
        .json({ error: "Some internal server error occured !" });
    }
  }
);

//ROUTE 2:  User Login With POST api/auth/login, dont require auth      """" LOGIN """"
router.post(
  "/login",
  [
    body("email", "Please Enter A Valid Email").isEmail(),
    body("password", "Password Cannot Be Blank").exists(),
  ],
  async (request, response) => {
    // Checking for input errors and return 400 Bad request & errors
    const errors = await validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.mapped() });
    }

    // Binding in try Catch
    try {
      // checking if user exist or not and return 404 Invalid Email Or Password
      const user = await User.findOne({ email: request.body.email });
      if (!user) {
        return response
          .status(400)
          .json({ error: "Invalid Email or Password" });
      }

      // checking if password is correct or not using bcrypt.compare
      const isCredTrue = await bcrypt
        .compare(request.body.password, user.password)
        .catch((err) => console.log(err.message));

      // sending error if passwords dont match
      if (!isCredTrue) {
        return response
          .status(400)
          .json({ error: "Invalid Email or Password" });
      }

      const data = {
          user:{
              id: user._id,
          }
      };
      const authToken = jwt.sign(data, JWT_SECRETE);
      response.json({ authToken });
    } catch (error) {
      response
        .status(500)
        .json({ error: "Some Internal Server Error Occured!" });
    }
  }
);

// ROUTE 3: Get LoggedIn User Details, GET api/auth/getUser  Login Required...
router.get('/getUser', fetchUser, async(request,response) => {
    try {
        const userId = request.user.id;
        const user = await User.findById(userId).select('-password')
        response.json(user)
        
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;