const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Making a JWT secrete
const JWT_SECRETE = "DarshanPatel";

// Create a user using Post "api/auth/createUser". Doesn't require auth
router.post(
  "/createUser",
  [
    body("name", "Enter A Valid Name").isLength({ min: 3 }),
    body("email", "Enter A Valid Email").isEmail(),
    body("password", "Enter A valid Password").isLength({ min: 6 }),
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

      response.json({authToken});

    } catch (error) {
      console.error(error.message);
      response
        .status(500)
        .json({ error: "Some internal server error occured !" });
    }
  }
);

module.exports = router;
