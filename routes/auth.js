const express = require('express');
const User = require('../models/User');
const router = express.Router();


// Create a user using Post "api/auth". Doesn't require auth
router.post('/',(request, response) => {
    const user = User(request.body);
    user.save();
    response.send(request.body)
})


module.exports = router;