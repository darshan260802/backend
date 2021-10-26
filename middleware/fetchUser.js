const { request } = require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRETE = "DarshanPatel";


// creating a middleware function to fetch user from JWT Token
const fetchUser = (request, response, next) => {
    // Get user from JWT Token and add id to request object
    const token = request.header('auth-token');
    // if no token in header then return error 401: Unauthorised Access
    if(!token)
    {
        response.status(401).json({error: "Please Login With Valid Token!"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRETE)
        request.user = data.user;
        next();
    } catch (error) {
        response.status(401).json({error:'k'})
    }
}

module.exports = fetchUser;