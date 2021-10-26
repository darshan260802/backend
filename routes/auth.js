const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

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

      await User.create({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      })
        .then((user) => response.json(user))
        .catch((err) =>
          response
            .status(500)
            .json({ error: "Internal Server Error", message: err.message })
        );
    } catch (error) {
      console.error(error.message);
      response.status(500).json({error:'Some internal server error occured !'})
    }
  }
);

module.exports = router;
